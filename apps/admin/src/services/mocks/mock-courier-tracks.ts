import type {DeliveryType} from "@/types/assignment-types";
import type {CourierNodeRef, CourierRow, CourierServiceTier, CourierTrack, CourierTrackStatus} from "@/types/couriers-types";

/** Named Lagos nodes — the teal cube markers and route endpoints on the tracking map. */
const NODES: CourierNodeRef[] = [
  {name: "Ikeja", code: "IK-023", zone: "Ikeja", position: [3.3495, 6.6018]},
  {name: "Lekki Node", code: "LK-123", zone: "Lekki", position: [3.473, 6.4474]},
  {name: "Super Node", code: "SN-001", zone: "Lekki", position: [3.4215, 6.429]},
  {name: "Yaba Node", code: "YA-017", zone: "Yaba", position: [3.3753, 6.5095]},
  {name: "Surulere Hub", code: "SU-082", zone: "Surulere", position: [3.351, 6.4927]},
];

const TYPES: DeliveryType[] = ["bulk", "node", "express"];
const TIERS: CourierServiceTier[] = ["standard", "express"];

function seedOf(id: string): number {
  return id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

/** Midpoint nudged off the straight line so the route reads as a street path, not a ruler. */
function routePath(from: [number, number], to: [number, number], bend: number): [number, number][] {
  const mid: [number, number] = [(from[0] + to[0]) / 2 + bend / 900, (from[1] + to[1]) / 2 - bend / 1100];
  return [from, mid, to];
}

/** Tracks run only for active, verified couriers — pending/flagged/suspended rows never ride. */
function eligible(rows: CourierRow[]): CourierRow[] {
  return rows.filter((row) => row.status === "active" && row.verification === "verified");
}

/** One deterministic track for a courier row — every field the card and popup render. */
export function courierTrackFor(row: CourierRow, index: number): CourierTrack {
  const seed = seedOf(row.id);
  const pickup = NODES[(seed + index) % NODES.length];
  const dropoff = NODES[(seed + index + 3) % NODES.length];
  const status: CourierTrackStatus = (seed + index) % 6 === 3 ? "delayed" : "in_transit";
  const etaMinutes = 15 + ((seed + index * 7) % 41);
  return {
    courierId: row.id,
    name: row.name,
    photoUrl: row.photoUrl,
    vehicle: row.vehicle,
    status,
    motion: status === "delayed" ? "idle" : "enroute",
    publicPool: (seed + index) % 3 === 0,
    type: TYPES[(seed + index * 5) % TYPES.length],
    batchId: `B-${2000 + ((seed * 13 + index * 97) % 8000)}`,
    items: 1 + ((seed + index * 7) % 60),
    pickup,
    dropoff,
    etaMinutes,
    distanceKm: 4 + ((seed + index * 3) % 42),
    position: row.position,
    routePath: routePath(pickup.position, row.position, ((seed % 7) - 3) * (index % 2 === 0 ? 1 : -1)),
    lastKnownLocation: `${row.zone}, Lagos`,
    offlineMinutes: (seed + index) % 9,
    rating: 4.1 + ((seed + index * 11) % 8) / 10,
    serviceTier: TIERS[(seed + index * 3) % TIERS.length],
    etaAt: new Date(Date.now() + etaMinutes * 60_000).toISOString(),
    phone: `0801 ${200 + (index % 9)}0 ${String(3300 + index * 37).slice(-4)}`,
  };
}

/** The active-assignment feed — same count the list metrics report as "On Assignment". */
export function courierTracksFor(rows: CourierRow[], count: number): CourierTrack[] {
  const pool = eligible(rows);
  const stride = Math.max(1, Math.floor(pool.length / Math.max(count, 1)));
  return pool
    .filter((_, index) => index % stride === 0)
    .slice(0, count)
    .map(courierTrackFor);
}
