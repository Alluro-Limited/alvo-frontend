import type {UserActivity, UserDetail, UserFlag, UserParcel, UserRow, UserSuspension} from "@/types/users-types";
import type {ParcelStatus} from "@/types/workloads-types";

const RECIPIENTS = [
  "Hauwa Zubairu",
  "Miebi Obubra",
  "Hauwa Kabiru",
  "Umar Usman",
  "Emeka Anyaoku",
  "Ekiye Opuene",
  "Chisom Agu",
  "Dayo Faleti",
];
const DESTINATIONS = [
  "Ikeja, Lagos (IK-022)",
  "Lekki, Lagos (LK-015)",
  "Yaba, Lagos (YA-017)",
  "Surulere, Lagos (SU-082)",
  "Ajah, Lagos (AJ-903)",
];
const COURIER_CODES = ["PRG-021", "PRG-034", "PRG-041", "PRG-058", "PRG-069", "PRG-085"];
const PARCEL_STATUSES: ParcelStatus[] = ["pending_pickup", "in_transit", "delivered", "failed", "expired"];

function activityFor(row: UserRow, index: number): UserActivity[] {
  return [
    {id: `${row.id}-a1`, label: `Parcel PRV-${88000 + index * 13} dropped off`, at: "Today, 10:14 AM"},
    {id: `${row.id}-a2`, label: "Wallet topped up · ₦5,000", at: "Today, 9:30 AM"},
    {
      id: `${row.id}-a3`,
      label: "Account created",
      at: new Date(row.joinedAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}),
    },
  ];
}

/** Builds the drawer payload for a user row, folding in live flag/suspension records. */
export function userDetailFor(
  row: UserRow,
  index: number,
  records: {flag: UserFlag | null; suspension: UserSuspension | null}
): UserDetail {
  const {flag, suspension} = records;
  const parcelsSent = 12 + ((index * 7) % 24);
  return {
    ...row,
    flag,
    suspension,
    walletBalanceKobo: 620_000 + ((index * 91_300) % 4_800_000),
    totalSpentKobo: 2_410_000 + ((index * 173_700) % 9_600_000),
    parcelsSent,
    parcelsDelivered: Math.max(0, parcelsSent - 2 - (index % 6)),
    recentActivity: activityFor(row, index),
  };
}

/** Deterministic parcels for the drawer's "View all items" modal. */
export function userParcelsFor(row: UserRow, count: number): UserParcel[] {
  const seed = row.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Array.from({length: count}, (_, i) => {
    const status = PARCEL_STATUSES[(seed + i) % PARCEL_STATUSES.length];
    const done = status === "delivered" || status === "expired";
    return {
      id: `PRV-${88000 + ((seed * 13 + i * 97) % 9000)}`,
      recipient: RECIPIENTS[(seed + i * 3) % RECIPIENTS.length],
      destination: DESTINATIONS[(seed + i * 5) % DESTINATIONS.length],
      courier: COURIER_CODES[(seed + i) % COURIER_CODES.length],
      status,
      sla: done ? "Done" : `${1 + ((seed + i) % 3)}h ${String((seed * i + 14) % 60).padStart(2, "0")}m`,
    };
  });
}
