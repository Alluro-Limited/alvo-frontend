import type {CompletedDelivery, DeliveriesOverview, DeliveriesService, DeliveryAnalytics} from "@/types/deliveries-types";
import {mockHomeService} from "./mock-home-service";
import {mockDelay} from "./mock-http";

/** The completed rows from the Figma — repeat the two jobs so the list scrolls. */
const COMPLETED: CompletedDelivery[] = [
  {
    id: "PRI-4728123780",
    kind: "regular",
    payout: 2900,
    originNode: "Node P13, Lekki",
    destinationNode: "Node P08, Lekki",
    packages: 14,
    distanceKm: 3.4,
    dateLabel: "20th Dec, 2025 · 9:45",
  },
  {
    id: "SPD-4728123780",
    kind: "speed",
    payout: 2900,
    originNode: "Node P13, Lekki",
    destinationNode: "Node P08, Lekki",
    packages: 14,
    distanceKm: 3.4,
    dateLabel: "20th Dec, 2025 · 9:45",
  },
  {
    id: "PRI-4728123781",
    kind: "regular",
    payout: 2900,
    originNode: "Node P13, Lekki",
    destinationNode: "Node P08, Lekki",
    packages: 14,
    distanceKm: 3.4,
    dateLabel: "20th Dec, 2025 · 9:45",
  },
  {
    id: "PRI-4728123782",
    kind: "regular",
    payout: 2900,
    originNode: "Node P13, Lekki",
    destinationNode: "Node P08, Lekki",
    packages: 14,
    distanceKm: 3.4,
    dateLabel: "20th Dec, 2025 · 9:45",
  },
];

const ANALYTICS: DeliveryAnalytics = {
  allTimeJobs: 103,
  todayJobs: 2,
  allTimeEarnings: 145900,
  todayEarnings: 3200,
  weeklyJobs: [30, 55, 40, 65, 55, 75, 50],
};

/**
 * In-memory stand-in for the backend while it does not exist. The milestone slot reuses
 * the home job so both tabs stay in sync. Never ships when `VITE_API_URL` is set.
 */
export const mockDeliveriesService: DeliveriesService = {
  getDeliveries: async (): Promise<DeliveriesOverview> => {
    const home = await mockHomeService.getHome();
    return {active: home.jobs[0] ?? null, completed: [...COMPLETED]};
  },
  getAnalytics: async () => {
    await mockDelay(300);
    return {...ANALYTICS, weeklyJobs: [...ANALYTICS.weeklyJobs]};
  },
};
