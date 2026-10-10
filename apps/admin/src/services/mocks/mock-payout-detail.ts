import type {PayoutDelivery, PayoutDetail, PayoutDispute, PayoutDisputeStatus, PayoutRow} from "@/types/payouts-types";
import type {DeliveryType} from "@/types/assignment-types";

const ISSUE_TITLES = ["Damaged parcel", "Lost package", "Delayed delivery", "Missing items", "Suspected fraud"];
const DISPUTE_DESCRIPTIONS = [
  "Customer reported the parcel arrived with visible damage to the outer packaging and two missing items.",
  "Package was marked delivered but the recipient never received it — GPS shows an off-route drop.",
  "Delivery arrived two days after the promised SLA, causing a refund request from the sender.",
  "Reconciliation flagged a mismatch between the delivered items and the waybill count.",
  "Duplicate delivery receipts detected on the same route — under investigation.",
];
const ROUTES = [
  ["Lekki", "VI"],
  ["VI", "Yaba"],
  ["Ikeja", "Surulere"],
  ["Yaba", "Lekki"],
  ["Ajah", "Ikeja"],
];
const TYPES: DeliveryType[] = ["bulk", "node", "express"];
const DISPUTE_STATUSES: PayoutDisputeStatus[] = ["open", "investigating", "resolved"];

function hash(value: string): number {
  let out = 0;
  for (const char of value) out = (out * 31 + char.charCodeAt(0)) % 1_000_003;
  return out;
}

/** Seeded disputes for withheld/flagged rows — mutations append on top. */
export function seededDisputes(row: PayoutRow, cycle: string): PayoutDispute[] {
  if (row.status !== "withheld" && row.status !== "flagged") return [];
  const seed = hash(`${row.courierId}:${cycle}`);
  const count = 1 + (seed % 2);
  return Array.from({length: count}, (_, index) => ({
    id: `DSP-${1000 + ((seed + index * 37) % 9000)}`,
    parcelId: `PRC-${1000 + ((seed + index * 53) % 9000)}`,
    title: ISSUE_TITLES[(seed + index) % ISSUE_TITLES.length],
    // Index 0 always stays unresolved so the issue cards never render "0 issues —".
    status: index === 0 ? "open" : DISPUTE_STATUSES[(seed + index) % (row.status === "flagged" ? 2 : 3)],
    description: DISPUTE_DESCRIPTIONS[(seed + index * 2) % DISPUTE_DESCRIPTIONS.length],
    date: `2026-06-${String(8 + ((seed + index * 7) % 18)).padStart(2, "0")}`,
  }));
}

/** Seeded settlement date for rows that arrive paid — mutations stamp their own instead. */
export function seededPaidAt(row: PayoutRow, cycle: string): string | null {
  if (row.status !== "paid" && row.status !== "flagged") return null;
  const seed = hash(`${row.courierId}:${cycle}`);
  return `2026-06-${String(14 + (seed % 12)).padStart(2, "0")}`;
}

/** Deterministic detail payload — bank fields come from the row, the rest derives from its id. */
export function payoutDetailFor(row: PayoutRow, disputes: PayoutDispute[], paidAt: string | null): PayoutDetail {
  return {
    courierId: row.courierId,
    name: row.name,
    photoUrl: row.photoUrl,
    status: row.status,
    deliveriesCompleted: row.deliveries,
    grossEarnings: row.netPayout,
    netPayout: row.netPayout,
    bank: {bankName: row.bankName, accountNumber: row.accountNumber, accountHolder: row.name},
    disputes,
    paidAt,
  };
}

/** Deterministic deliveries for the modal — earned sums drive the footer total. */
export function payoutDeliveriesFor(row: PayoutRow, cycle: string): PayoutDelivery[] {
  const seed = hash(`${row.courierId}:${cycle}:deliveries`);
  const count = Math.min(row.deliveries, 24);
  return Array.from({length: count}, (_, index) => {
    const route = ROUTES[(seed + index * 3) % ROUTES.length];
    const day = 1 + ((seed + index * 11) % 27);
    return {
      date: `2026-06-${String(day).padStart(2, "0")}`,
      id: `ASN-${1000 + ((seed + index * 97) % 9000)}`,
      type: TYPES[(seed + index) % TYPES.length],
      pickup: route[0],
      dropoff: route[1],
      items: 1 + ((seed + index * 13) % 60),
      earned: (1 + ((seed + index * 7) % 4)) * 1000 + 500,
      status: index % 11 === 10 ? "failed" : index % 7 === 6 ? "cancelled" : "completed",
    };
  });
}
