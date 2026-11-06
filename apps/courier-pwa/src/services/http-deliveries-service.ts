import {dayLabel, formatOrdinalDate, formatTime} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import {JOB_STAGE, toCourierJob} from "@/services/http-home-service";
import type {
  ApiCourierJob,
  ApiGetAnalyticsResponse,
  ApiListJobsResponse,
  ApiListNotificationsResponse,
  ApiNotification,
} from "@/types/api-types";
import type {
  CompletedDelivery,
  CourierNotification,
  DeliveriesService,
  DeliveryAnalytics,
  NotificationCategory,
  NotificationIcon,
  NotificationsService,
} from "@/types/deliveries-types";

const toCompleted = (job: ApiCourierJob): CompletedDelivery => ({
  id: job.id,
  kind: "regular",
  payout: koboToNaira(job.earningsKobo),
  originNode: "",
  destinationNode: "",
  packages: 0,
  distanceKm: 0,
  dateLabel: formatOrdinalDate(job.offeredAt),
});

const jobsByState = (state: string) => apiClient.get("v1/courier/jobs", {searchParams: {state}}).json<ApiListJobsResponse>();

/**
 * Deliveries against `v1/courier/jobs` (accepted + completed) and `v1/courier/analytics`.
 * The wire job has no route/distance/package fields; analytics' `today` figures come from
 * the last bucket when it is today's.
 */
export const httpDeliveriesService: DeliveriesService = {
  getDeliveries: async () => {
    const [accepted, completed] = await Promise.all([jobsByState("JOB_STATE_ACCEPTED"), jobsByState("JOB_STATE_COMPLETED")]);
    return {active: accepted.jobs[0] ? toCourierJob(accepted.jobs[0]) : null, completed: completed.jobs.map(toCompleted)};
  },
  getAnalytics: async (): Promise<DeliveryAnalytics> => {
    const res = await apiClient.get("v1/courier/analytics").json<ApiGetAnalyticsResponse>();
    const jobs = res.buckets.map((b) => Number(b.jobs));
    const peak = Math.max(...jobs, 1);
    const last = res.buckets[res.buckets.length - 1];
    return {
      allTimeJobs: Number(res.completedJobs),
      todayJobs: last ? Number(last.jobs) : 0,
      allTimeEarnings: koboToNaira(res.earningsKobo),
      todayEarnings: last ? koboToNaira(last.earningsKobo) : 0,
      weeklyJobs: jobs.slice(0, 7).map((n) => Math.round((n / peak) * 100)),
    };
  },
};

const CATEGORY: Record<string, NotificationCategory> = {
  NOTIFICATION_CATEGORY_PAYMENT: "earning",
  NOTIFICATION_CATEGORY_DELIVERIES: "delivery",
};

const iconFor = (n: ApiNotification): NotificationIcon => {
  const text = `${n.title} ${n.body}`.toLowerCase();
  if (CATEGORY[n.category] === "earning") return "earning";
  if (text.includes("complet")) return "completed";
  if (text.includes("assign") || text.includes("offer")) return "assigned";
  if (text.includes("speed")) return "speed";
  return "assigned";
};

const toNotification = (n: ApiNotification): CourierNotification => ({
  id: n.id,
  category: CATEGORY[n.category] ?? "delivery",
  icon: iconFor(n),
  title: n.title,
  body: n.body,
  time: formatTime(n.createdAt),
  dayLabel: dayLabel(n.createdAt),
  unread: !n.readAt,
});

export const httpNotificationsService: NotificationsService = {
  getNotifications: async () => {
    const res = await apiClient.get("v1/notifications", {searchParams: {limit: 50}}).json<ApiListNotificationsResponse>();
    return res.notifications.map(toNotification);
  },
};

export {JOB_STAGE};
