import type {AssignmentRow, DeliveryType, IdleCourier} from "@/types/assignment-types";

const COURIERS = [
  "Ekine Tamuno",
  "Yusuf Wakili",
  "Obinna Okechukwu",
  "Perebuowei Werinipre",
  "Aliyu Bala",
  "Seiye Alamina",
  "Femi Oladipo",
  "Tamuno Briggs",
  "Kelechi Nnamdi",
  "Adaeze Obi",
];

const ORIGINS: {place: string; pos: [number, number]}[] = [
  {place: "VI-034 · Victoria Island", pos: [3.4145, 6.4281]},
  {place: "YA-017 · Yaba", pos: [3.3792, 6.5095]},
  {place: "EP-028 · Epe", pos: [3.9834, 6.5839]},
  {place: "SU-082 · Surulere", pos: [3.3609, 6.4969]},
  {place: "LK-011 · Lekki Phase 1", pos: [3.4738, 6.4477]},
];

const DESTINATIONS: {place: string; pos: [number, number]}[] = [
  {place: "Super Node · Ikeja", pos: [3.3612, 6.6018]},
  {place: "MD-487 · Maryland", pos: [3.3699, 6.5716]},
  {place: "VI-839 · Victoria Island", pos: [3.4216, 6.4326]},
  {place: "IK-721 · Ikorodu", pos: [3.5102, 6.6194]},
  {place: "AJ-903 · Ajah", pos: [3.5713, 6.4686]},
];

/** Hand-authored rows mirroring the Figma table, plus generated rows for pagination. */
const SHOWCASE: AssignmentRow[] = [
  {
    id: "ASN-1089",
    type: "node",
    courier: null,
    pickup: "Super Node · Ikeja",
    dropoff: "MD-487 · Maryland",
    items: 61,
    status: "public_pool",
    position: [3.3699, 6.5716],
  },
  {
    id: "ASN-0001",
    type: "bulk",
    courier: "Ekine Tamuno",
    pickup: "VI-034 · Victoria Island",
    dropoff: "Super Node · Ikeja",
    items: 37,
    status: "created",
    position: [3.3612, 6.6018],
  },
  {
    id: "ASN-0027",
    type: "bulk",
    courier: "Yusuf Wakili",
    pickup: "YA-017 · Yaba",
    dropoff: "Super Node · Ikeja",
    items: 43,
    status: "pending_pickup",
    position: [3.3612, 6.6018],
  },
  {
    id: "ASN-2017",
    type: "node",
    courier: "Obinna Okechukwu",
    pickup: "Super Node · Ikeja",
    dropoff: "VI-839 · Victoria Island",
    items: 52,
    status: "flagged",
    position: [3.4216, 6.4326],
  },
  {
    id: "ASN-0182",
    type: "express",
    courier: "Perebuowei Werinipre",
    pickup: "EP-028 · Epe",
    dropoff: "IK-721 · Ikorodu",
    items: 1,
    status: "failed",
    position: [3.5102, 6.6194],
  },
  {
    id: "ASN-0382",
    type: "node",
    courier: "Aliyu Bala",
    pickup: "Super Node · Ikeja",
    dropoff: "AJ-903 · Ajah",
    items: 28,
    status: "active",
    position: [3.5713, 6.4686],
  },
  {
    id: "ASN-0333",
    type: "bulk",
    courier: "Seiye Alamina",
    pickup: "SU-082 · Surulere",
    dropoff: "Super Node · Ikeja",
    items: 19,
    status: "completed",
    position: [3.3612, 6.6018],
  },
  {
    id: "ASN-4401",
    type: "bulk",
    courier: "Adebayo Kalu",
    pickup: "LK-011 · Lekki Phase 1",
    dropoff: "SN-001 · Super Node Lagos",
    items: 24,
    status: "active",
    position: [3.3612, 6.6018],
  },
];

const GENERATED_STATUSES: AssignmentRow["status"][] = [
  "active",
  "pending_pickup",
  "completed",
  "public_pool",
  "failed",
  "created",
  "active",
  "pending_pickup",
  "completed",
  "active",
];

const GENERATED_TYPES: DeliveryType[] = ["bulk", "node", "express", "node", "bulk", "node", "bulk", "express", "node", "bulk"];

/** Generated rows — deterministic so tests and pagination stay stable. */
function generatedRow(index: number): AssignmentRow {
  const origin = ORIGINS[index % ORIGINS.length];
  const destination = DESTINATIONS[index % DESTINATIONS.length];
  const status = GENERATED_STATUSES[index % GENERATED_STATUSES.length];
  const unassigned = status === "public_pool" || status === "created";
  const id = `ASN-${(4402 + index).toString().padStart(4, "0")}`;
  return {
    id,
    type: GENERATED_TYPES[index % GENERATED_TYPES.length],
    courier: unassigned ? null : COURIERS[index % COURIERS.length],
    pickup: origin.place,
    dropoff: destination.place,
    items: 3 + ((index * 7) % 58),
    status,
    position: destination.pos,
  };
}

export const ASSIGNMENT_SEEDS: AssignmentRow[] = [...SHOWCASE, ...Array.from({length: 335}, (_, index) => generatedRow(index))];

/** Idle couriers offered in manual-assign step 2 — names/zones from the Figma modal. */
export const IDLE_COURIERS: IdleCourier[] = [
  {id: "courier-firdausi", name: "Firdausi Kabiru", code: "PRG-047", rank: 7, zones: ["Ikeja", "Maryland", "Ojota"], successRate: 92},
  {id: "courier-ifedayo", name: "Ifedayo Adebayo", code: "PRG-083", rank: 3, zones: ["Surulere", "Mushin", "Yaba"], successRate: 88},
  {id: "courier-boma", name: "Boma Pakabo", code: "PRG-015", rank: 9, zones: ["Ikoyi", "Victoria Island", "Lekki"], successRate: 95},
  {id: "courier-chukwudi", name: "Chukwudi Nwachukwu", code: "PRG-029", rank: 2, zones: ["Mushin", "Surulere", "Yaba"], successRate: 96},
  {id: "courier-binaebi", name: "Binaebi Taribo", code: "PRG-062", rank: 5, zones: ["Ojodu", "Agege", "Ikeja"], successRate: 85},
];
