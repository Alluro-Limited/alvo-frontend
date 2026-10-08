import type {PayoutCycle, PayoutRow, PayoutStatus} from "@/types/payouts-types";
import {COURIER_SEEDS} from "./mock-courier-seeds";

/** Newest first — the header cycle select and every payout query key off these ids. */
export const PAYOUT_CYCLES: PayoutCycle[] = [
  {id: "2026-06B", label: "June 16 - 30, 2026"},
  {id: "2026-06A", label: "June 1 - 15, 2026"},
  {id: "2026-05B", label: "May 16 - 31, 2026"},
];

const BANKS = ["GTBank", "Unity Bank", "Access Bank", "Zenith Bank", "First Bank", "UBA", "Kuda Bank", "Sterling Bank"];

/** Per-courier rate in naira — mirrors the design's ₦350–₦550 per delivery range. */
const RATES = [350, 400, 450, 500, 550, 380, 420];

const STATUS_PATTERN: PayoutStatus[] = [
  "not_paid",
  "paid",
  "not_paid",
  "withheld",
  "paid",
  "not_paid",
  "paid",
  "not_paid",
  "flagged",
  "paid",
  "not_paid",
  "withheld",
  "paid",
  "not_paid",
  "paid",
  "not_paid",
  "paid",
  "withheld",
  "not_paid",
  "flagged",
  "paid",
  "not_paid",
  "paid",
  "not_paid",
];

/** Verified couriers only — pending accounts never reach a payout cycle. */
const COURIERS = COURIER_SEEDS.filter((row) => row.verification === "verified").slice(0, 24);

/** A cycle's ordinal — older cycles drift the deterministic values slightly. */
function cycleIndex(cycle: string): number {
  const index = PAYOUT_CYCLES.findIndex((entry) => entry.id === cycle);
  return index < 0 ? 0 : index;
}

/** Deterministic payout rows for one cycle — statuses skew toward paid in older cycles. */
export function payoutRowsFor(cycle: string): PayoutRow[] {
  const offset = cycleIndex(cycle);
  return COURIERS.map((courier, index) => {
    let status = STATUS_PATTERN[(index + offset * 5) % STATUS_PATTERN.length];
    // Older cycles settle more payouts — not_paid entries roll forward into paid.
    if (offset > 0 && status === "not_paid" && (index + offset) % 3 === 0) status = "paid";
    const deliveries = 18 + ((index * 37 + offset * 11) % 220);
    const netPayout = deliveries * RATES[(index + offset) % RATES.length];
    return {
      courierId: courier.id,
      name: courier.name,
      photoUrl: courier.photoUrl,
      accountNumber: String(2_000_000_000 + ((index * 7919 + offset * 131) % 800_000_000)).padStart(10, "0"),
      bankName: BANKS[(index * 3 + offset) % BANKS.length],
      deliveries,
      netPayout,
      status,
    };
  });
}
