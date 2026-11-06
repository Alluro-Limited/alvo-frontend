import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {
  ApiCourierJob,
  ApiGetCourierProfileResponse,
  ApiGetHomeResponse,
  ApiGetMeResponse,
  ApiListJobsResponse,
  ApiListNodesResponse,
  ApiNode,
} from "@/types/api-types";
import type {CourierHomeService, CourierJob, DeliveryArea, JobStage} from "@/types/home-types";

export const JOB_STAGE: Record<string, JobStage> = {
  JOB_STATE_OFFERED: "assignment",
  JOB_STATE_ACCEPTED: "pending",
  JOB_STATE_COMPLETED: "complete",
  JOB_STATE_DECLINED: "assignment",
  JOB_STATE_EXPIRED: "assignment",
};

export const toCourierJob = (job: ApiCourierJob): CourierJob => ({
  id: job.id,
  kind: "regular",
  stage: JOB_STAGE[job.state] ?? "assignment",
  origin: "",
  destination: "",
  payout: koboToNaira(job.earningsKobo),
  packages: 0,
  pickupTime: "",
  eta: "",
  duration: "",
  distanceKm: 0,
});

const toArea = (node: ApiNode): DeliveryArea => ({id: node.id, name: node.name, address: node.accessNotes});

/**
 * Home against `v1/courier/home` (counts only), `v1/me`, `v1/courier/profile` and
 * `v1/courier/jobs`. The wire has no per-job route/distance fields, and no
 * unread-notification flag — those fields stay empty until the API grows them.
 */
export const httpHomeService: CourierHomeService = {
  getHome: async () => {
    const [me, profile, jobsRes] = await Promise.all([
      apiClient.get("v1/me").json<ApiGetMeResponse>(),
      apiClient.get("v1/courier/profile").json<ApiGetCourierProfileResponse>(),
      apiClient.get("v1/courier/jobs").json<ApiListJobsResponse>(),
    ]);
    const home = await apiClient
      .get("v1/courier/home")
      .json<ApiGetHomeResponse>()
      .catch(() => null);
    void home;
    const firstName = (me.user.preferredName || me.user.name).split(" ")[0] ?? "";
    return {
      firstName,
      area: profile.courier.areas[0] ?? "",
      isLive: true,
      unreadNotifications: false,
      jobs: jobsRes.jobs.filter((j) => j.state === "JOB_STATE_OFFERED").map(toCourierJob),
    };
  },
  setAvailability: async (live) => {
    await apiClient.post("v1/courier/availability", {json: {availability: live ? "AVAILABILITY_ONLINE" : "AVAILABILITY_OFFLINE"}});
  },
  acceptJob: async (jobId) => {
    await apiClient.post(`v1/courier/jobs/${jobId}/accept`);
  },
  declineJob: async (jobId) => {
    await apiClient.post(`v1/courier/jobs/${jobId}/decline`);
  },
  getAreas: async () => {
    const res = await apiClient.get("v1/nodes").json<ApiListNodesResponse>();
    return res.nodes.map(toArea);
  },
  setDeliveryArea: async (areaId) => {
    await apiClient.post("v1/courier/delivery-area", {json: {areas: [areaId]}});
  },
};
