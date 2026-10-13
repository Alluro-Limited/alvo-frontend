import type {JobOffer, JobsService} from "@/types/delivery-types";
import {mockDelay} from "./mock-http";

/** The offers from the Figma — decline removes one, accept removes it and takes the courier to the detail. */
const OFFERS: JobOffer[] = [
  {
    id: "PRI-4728123780",
    kind: "regular",
    origin: "Oshodi",
    originCode: "P011",
    destination: "Lekki",
    destinationCode: "P012",
    payout: 5400,
    packages: 32,
    distanceKm: 3.4,
    pickupBy: "4:50PM",
    deliverBy: "6:25PM",
  },
  {
    id: "SPD-4728123780",
    kind: "speed",
    origin: "Epe",
    originCode: "P005",
    destination: "Ijegun",
    destinationCode: "P010",
    payout: 2300,
    packages: 1,
    distanceKm: 3.4,
    pickupBy: "1:50PM",
    deliverBy: "6:25PM",
  },
  {
    id: "PRI-4728123781",
    kind: "regular",
    origin: "Ajah",
    originCode: "P003",
    destination: "Lekki",
    destinationCode: "P012",
    payout: 4300,
    packages: 14,
    distanceKm: 3.4,
    pickupBy: "1:50PM",
    deliverBy: "6:25PM",
  },
  {
    id: "PRI-4728123782",
    kind: "regular",
    origin: "Lekki",
    originCode: "P012",
    destination: "Ajah",
    destinationCode: "P003",
    payout: 2500,
    packages: 7,
    distanceKm: 3.4,
    pickupBy: "4:50PM",
    deliverBy: "6:25PM",
  },
];

let offers = [...OFFERS];

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockJobsService: JobsService = {
  getJobs: async () => {
    await mockDelay(300);
    return [...offers];
  },
  acceptJob: async (jobId) => {
    await mockDelay(400);
    offers = offers.filter((o) => o.id !== jobId);
  },
  declineJob: async (jobId) => {
    await mockDelay(300);
    offers = offers.filter((o) => o.id !== jobId);
  },
};
