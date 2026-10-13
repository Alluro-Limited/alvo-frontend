import type {HomeService, LockerDetail, LockerPin} from "@/types/home-types";
import {mockDelay} from "./mock-http";

let area = "Oshodi";

/** Pin positions are percentages of the map artwork, matching the design's pin layout. */
const LOCKERS: LockerPin[] = [
  {id: "p-001", label: "P-001", x: 56, y: 20, color: "#fffcf7"},
  {id: "p12", label: "P12", x: 36, y: 30, color: "#ff5c7a"},
  {id: "p02", label: "P02", x: 68, y: 33, color: "#00a996"},
  {id: "p04", label: "P04", x: 41, y: 56, color: "#f79009"},
  {id: "p05", label: "P05", x: 81, y: 46, color: "#ff5c7a"},
  {id: "p01", label: "P01", x: 66, y: 66, color: "#ff5c7a"},
  {id: "p06", label: "P06", x: 41, y: 85, color: "#a48afb"},
  {id: "p11", label: "P11", x: 5, y: 72, color: "#00a996"},
];

const AREAS = [
  {id: "a1", address: "129 Igbogbo Road, Ikorodu, Lagos", area: "Ikorodu, Lagos State"},
  {id: "a2", address: "Wukari-Mutum Biyu Road", area: "Ikorodu, Lagos State"},
  {id: "a3", address: "Birnin Kudu-Kafin Hausa Road", area: "Ikorodu, Lagos State"},
  {id: "a4", address: "129 Igbogbo Road, Ikorodu, Lagos", area: "Ikorodu, Lagos State"},
];

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockHomeService: HomeService = {
  getArea: async () => {
    await mockDelay();
    return area;
  },
  setArea: async (next) => {
    await mockDelay();
    area = next;
  },
  getLockers: async () => {
    await mockDelay();
    return LOCKERS;
  },
  getLocker: async (id): Promise<LockerDetail> => {
    await mockDelay();
    const pin = LOCKERS.find((l) => l.id === id) ?? LOCKERS[0];
    return {id: pin.id, name: `Locker ${pin.label} – Ikeja`, available: true, slots: 32};
  },
  searchAreas: async (query) => {
    await mockDelay();
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    // The design's sample results; unknown queries exercise the "No Results Found" state.
    if (q === "lekki" || q === "ikorodu" || q === "lagos") return AREAS;
    return [];
  },
};
