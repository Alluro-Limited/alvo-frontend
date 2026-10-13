import type {CourierHome, CourierHomeService, CourierJob, DeliveryArea, JobStage} from "@/types/home-types";
import {mockDelay} from "./mock-http";

/**
 * Inputs that drive the mock into each designed state: start offline, flip live to get the
 * Oshodi→Ajah assignment, Accept to reach "pending". Enroute/complete are backend-driven,
 * so the mock only reaches them if a future scenario seeds them.
 */
const state: {live: boolean; regularStage: JobStage | null; area: string} = {live: false, regularStage: null, area: "Oshodi"};

/** The Change Delivery Area list — Lagos locker nodes and neighborhoods from the design. */
const AREAS: DeliveryArea[] = [
  {id: "lekki-mall", name: "Lekki Mall Node", address: "Second Entrance, Lekki Mall Node, Lagos State"},
  {id: "ikorodu", name: "Ikorodu Node", address: "Ikorodu, Lagos State"},
  {id: "vi-node", name: "Victoria Island Node", address: "Victoria Island, Lagos State"},
  {id: "lekki", name: "Lekki Node", address: "Lekki, Lagos State"},
  {id: "vi", name: "Victoria Island", address: "Lagos, Lagos State"},
  {id: "ikoyi", name: "Ikoyi", address: "Lagos, Lagos State"},
  {id: "surulere", name: "Surulere", address: "Lagos, Lagos State"},
];

function regularJob(): CourierJob {
  return {
    id: "PRI-4728123780",
    kind: "regular",
    stage: state.regularStage ?? "assignment",
    origin: "OSHODI",
    destination: "AJAH",
    payout: 4000,
    packages: 7,
    pickupTime: "17:50",
    eta: "19:05",
    duration: "1HR 15MIN",
    distanceKm: 3.5,
  };
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockHomeService: CourierHomeService = {
  getHome: async () => {
    await mockDelay(300);
    const home: CourierHome = {
      firstName: "Olatunji",
      area: state.area,
      isLive: state.live,
      unreadNotifications: true,
      jobs: [],
    };
    if (state.live && state.regularStage) home.jobs.push(regularJob());
    return home;
  },
  setAvailability: async (live) => {
    await mockDelay(300);
    state.live = live;
    if (live && state.regularStage === null) state.regularStage = "assignment";
  },
  acceptJob: async () => {
    await mockDelay(400);
    if (state.regularStage === "assignment") state.regularStage = "pending";
  },
  declineJob: async () => {
    await mockDelay(400);
    state.regularStage = null;
  },
  getAreas: async () => {
    await mockDelay(250);
    return [...AREAS];
  },
  setDeliveryArea: async (areaId) => {
    await mockDelay(350);
    const area = AREAS.find((a) => a.id === areaId);
    if (area) state.area = area.name.replace(" Node", "");
  },
};
