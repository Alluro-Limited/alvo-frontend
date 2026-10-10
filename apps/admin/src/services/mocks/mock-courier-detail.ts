import type {DeliveryType} from "@/types/assignment-types";
import type {
  CourierAssignment,
  CourierAssignmentStatus,
  CourierDetail,
  CourierFlag,
  CourierRow,
  CourierSuspension,
  CourierVerificationItem,
  CourierVerificationItemKey,
  VehicleType,
} from "@/types/couriers-types";

const BRANDS: Record<VehicleType, string> = {
  bicycle: "Trek FX2",
  car: "Toyota Corolla",
  motorcycle: "Qlink XP-200",
  van: "Ford Transit",
};

const ITEM_KEYS: CourierVerificationItemKey[] = ["phone_email", "id_account", "drivers_licence", "vehicle_photo", "background_check"];

/** Document items carry a file the admin can preview; contact/check items are mark-approve only. */
const FILE_ITEMS = new Set<CourierVerificationItemKey>(["drivers_licence", "vehicle_photo"]);

const PICKUPS = ["Super Node · Ikeja", "VI-034 · VI", "YA-017 · Yaba", "VI-839 · VI", "EP-028 · Epe", "AJ-903 · Ajah", "SU-082 · Surulere"];
const DROPOFFS = ["MD-487 · Maryland", "IK-721 · Ikorodu", "LK-015 · Lekki", "AB-211 · Aba", "OS-066 · Oshodi", "EJ-304 · Ejigbo"];
const TYPES: DeliveryType[] = ["node", "bulk", "express"];
const ASSIGNMENT_STATUSES: CourierAssignmentStatus[] = ["completed", "completed", "completed", "cancelled", "failed"];

function seedOf(id: string): number {
  return id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function slug(name: string): string {
  return name.split(/\s+/)[0]?.toLowerCase() ?? "courier";
}

/** Verification items — pending couriers get everything submitted for review; verified ones are all approved. */
export function courierVerificationItems(row: CourierRow, overrides?: Map<CourierVerificationItemKey, string>): CourierVerificationItem[] {
  return ITEM_KEYS.map((key) => ({
    key,
    status: overrides?.has(key) ? "approved" : row.verification === "verified" ? "approved" : "submitted",
    fileName: FILE_ITEMS.has(key) ? `${key === "drivers_licence" ? "licence" : "car"}_${slug(row.name)}.jpg` : null,
  }));
}

/** Derives the row-level verification pill from the items — all approved means verified. */
export function verificationOf(items: CourierVerificationItem[]): CourierRow["verification"] {
  return items.every((item) => item.status === "approved") ? "verified" : "pending";
}

/** Builds the drawer payload for a courier row, folding in live flag/suspension records and item approvals. */
export function courierDetailFor(
  row: CourierRow,
  index: number,
  records: {flag: CourierFlag | null; suspension: CourierSuspension | null; approvals?: Map<CourierVerificationItemKey, string>}
): CourierDetail {
  const verificationItems = courierVerificationItems(row, records.approvals);
  const verified = row.verification === "verified";
  const deliveries = verified ? 40 + ((index * 17) % 190) : 0;
  return {
    id: row.id,
    name: row.name,
    photoUrl: row.photoUrl,
    status: row.status,
    verification: verificationOf(verificationItems),
    fullName: row.name,
    email: `${row.name
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .replace(/\s+/g, "")}${780 + index}@gmail.com`,
    phone: `0801 234 ${String(5678 - index * 37).padStart(4, "0")}`,
    age: 24 + ((index * 3) % 17),
    nin: String(7_2628_9172 + index * 1047),
    vehicle: row.vehicle,
    vehicleBrand: BRANDS[row.vehicle],
    plateNumber: `${String.fromCharCode(65 + (index % 26))}${String.fromCharCode(65 + ((index * 5) % 26))}${720 + index}${String.fromCharCode(73 + (index % 8))}JK`,
    zone: row.zone,
    joinedAt: `202${5 + (index % 2)}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}T09:00:00Z`,
    verificationItems,
    performance: {
      rank: row.rank || 0,
      successRate: row.successRate ?? 0,
      slaRate: verified ? 90 + ((index * 3) % 9) : 0,
      avgTimeMinutes: verified ? 24 + ((index * 7) % 30) : 0,
      totalDeliveries: deliveries,
      outOfZone: verified ? Math.floor(deliveries * 0.12) : 0,
    },
    flag: records.flag,
    suspension: records.suspension,
  };
}

/** Deterministic deliveries behind the Assignment History modal. */
export function courierAssignmentsFor(row: CourierRow, count: number): CourierAssignment[] {
  const seed = seedOf(row.id);
  return Array.from({length: count}, (_, i) => {
    const day = 19 - (i % 15);
    const month = 5 - Math.floor((i % 60) / 15);
    const type = TYPES[(seed + i) % TYPES.length];
    return {
      date: `2026-${String(Math.max(month, 1)).padStart(2, "0")}-${String(Math.max(day, 1)).padStart(2, "0")}T14:30:00Z`,
      id: `ASN-${String((seed * 13 + i * 97) % 4000).padStart(4, "0")}`,
      type,
      pickup: PICKUPS[(seed + i * 3) % PICKUPS.length],
      dropoff: DROPOFFS[(seed + i * 5) % DROPOFFS.length],
      items: 1 + ((seed + i * 7) % 60),
      status: ASSIGNMENT_STATUSES[(seed + i) % ASSIGNMENT_STATUSES.length],
    };
  });
}
