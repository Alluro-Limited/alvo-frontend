import type {CourierRow, CourierStatus, VehicleType} from "@/types/couriers-types";

/** Hand-authored rows mirroring the Figma table — PRG ids, zone ranks, mixed statuses. */
const SHOWCASE: Omit<CourierRow, "position">[] = [
  {
    id: "PRG-0215",
    rank: 6,
    name: "John Soyinka",
    photoUrl: null,
    vehicle: "bicycle",
    zone: "Lekki",
    verification: "verified",
    successRate: 81,
    status: "active",
  },
  {
    id: "PRG-0299",
    rank: 3,
    name: "Priscilla Awolowo",
    photoUrl: null,
    vehicle: "car",
    zone: "Muritala Airport",
    verification: "verified",
    successRate: 96,
    status: "active",
  },
  {
    id: "PRG-0302",
    rank: 1,
    name: "Martha Idamiebi",
    photoUrl: null,
    vehicle: "motorcycle",
    zone: "Ikorodu",
    verification: "verified",
    successRate: 95,
    status: "flagged",
  },
  {
    id: "PRG-0228",
    rank: 2,
    name: "James Danjuma",
    photoUrl: null,
    vehicle: "car",
    zone: "Victoria Island",
    verification: "verified",
    successRate: 88,
    status: "active",
  },
  {
    id: "PRG-0197",
    rank: 3,
    name: "Lydia Isa",
    photoUrl: null,
    vehicle: "motorcycle",
    zone: "Oshodi",
    verification: "verified",
    successRate: 91,
    status: "active",
  },
  {
    id: "PRG-0311",
    rank: 5,
    name: "Rebecca Kawu",
    photoUrl: null,
    vehicle: "car",
    zone: "Oshodi",
    verification: "verified",
    successRate: 87,
    status: "suspended",
  },
  {
    id: "PRG-0274",
    rank: 1,
    name: "Sarah Usman",
    photoUrl: null,
    vehicle: "car",
    zone: "Ajah",
    verification: "verified",
    successRate: 96,
    status: "active",
  },
  {
    id: "PRG-0165",
    rank: 0,
    name: "Hannah Opuogbo",
    photoUrl: null,
    vehicle: "car",
    zone: "Oshodi",
    verification: "pending",
    successRate: null,
    status: "active",
  },
  {
    id: "PRG-0132",
    rank: 0,
    name: "Martha Amakiri",
    photoUrl: null,
    vehicle: "van",
    zone: "Isolo",
    verification: "pending",
    successRate: null,
    status: "active",
  },
  {
    id: "PRG-0248",
    rank: 2,
    name: "Osas Igbinosa",
    photoUrl: null,
    vehicle: "motorcycle",
    zone: "Yaba",
    verification: "verified",
    successRate: 92,
    status: "flagged",
  },
];

const FIRST = [
  "Chinedu",
  "Adaeze",
  "Tunde",
  "Ngozi",
  "Ibrahim",
  "Fadeke",
  "Kelechi",
  "Halima",
  "Osas",
  "Yetunde",
  "Suleiman",
  "Omotola",
  "Nnamdi",
  "Balarabe",
  "Efe",
  "Adunni",
  "Danjuma",
  "Kelechi",
];
const LAST = [
  "Okafor",
  "Adeyemi",
  "Balogun",
  "Nwosu",
  "Danladi",
  "Haruna",
  "Eze",
  "Igbinedion",
  "Chukwu",
  "Musa",
  "Olawale",
  "Umeh",
  "Sule",
  "Adebanjo",
  "Yakubu",
];
const ZONES = [
  "Lekki",
  "Ikeja",
  "Yaba",
  "Surulere",
  "Ajah",
  "Oshodi",
  "Ikorodu",
  "Victoria Island",
  "Isolo",
  "Muritala Airport",
  "Maryland",
  "Epe",
];
const VEHICLES: VehicleType[] = ["bicycle", "car", "motorcycle", "van"];
const STATUSES: CourierStatus[] = ["active", "flagged", "suspended"];

/** Lagos metro bounds — markers land inside the same region the node/assignment maps show. */
const LAGOS_CENTER: [number, number] = [3.3792, 6.5244];

function positionFor(index: number): [number, number] {
  const lng = LAGOS_CENTER[0] + (((index * 37) % 100) - 50) / 220;
  const lat = LAGOS_CENTER[1] + (((index * 53) % 100) - 50) / 260;
  return [Number(lng.toFixed(4)), Number(lat.toFixed(4))];
}

/** Deterministic filler rows — ids start at PRG-0500 so they never collide with the showcase set. */
function generatedRows(count: number): Omit<CourierRow, "position">[] {
  return Array.from({length: count}, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 7) % LAST.length];
    // ~80% verified; pending couriers carry no success rate yet.
    const verification = i % 10 === 4 || i % 25 === 19 ? "pending" : "verified";
    const status: CourierStatus = i % 20 === 11 ? "suspended" : i % 10 === 7 ? "flagged" : STATUSES[0];
    return {
      id: `PRG-${500 + i}`,
      rank: verification === "verified" ? 1 + ((i * 3) % 8) : 0,
      name: `${first} ${last}`,
      photoUrl: null,
      vehicle: VEHICLES[i % VEHICLES.length],
      zone: ZONES[(i * 5) % ZONES.length],
      verification,
      successRate: verification === "verified" ? 78 + ((i * 11) % 22) : null,
      status,
    };
  });
}

export const COURIER_SEEDS: CourierRow[] = [...SHOWCASE, ...generatedRows(333)].map((row, index) => ({
  ...row,
  position: positionFor(index),
}));
