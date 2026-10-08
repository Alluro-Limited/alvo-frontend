import {API_ERROR_CODES} from "@/lib/api-errors";
import type {
  PayoutDetail,
  PayoutDispute,
  PayoutDisputeReason,
  PayoutIssueType,
  PayoutIssuesSummary,
  PayoutListParams,
  PayoutListResponse,
  PayoutMetrics,
  PayoutPaymentMethod,
  PayoutRow,
  PayoutsService,
  PayoutStatus,
} from "@/types/payouts-types";
import {payoutDeliveriesFor, payoutDetailFor, seededDisputes, seededPaidAt} from "./mock-payout-detail";
import {PAYOUT_CYCLES, payoutRowsFor} from "./mock-payout-seeds";
import {mockDelay, mockHttpError} from "./mock-http";

const PAGE_SIZE = 10;
const DELIVERIES_PAGE_SIZE = 10;
const CARD_PREVIEW_COUNT = 3;

const STATUS_FILTERS: PayoutStatus[] = ["paid", "not_paid", "withheld", "flagged"];
const ISSUE_TYPES: PayoutIssueType[] = ["damaged", "lost", "delayed", "missing_items", "fraud", "other"];
const DISPUTE_REASONS: PayoutDisputeReason[] = ["underpaid", "incorrect_amount", "missing_deliveries", "fraud", "other"];
const PAYMENT_METHODS: PayoutPaymentMethod[] = ["bank_transfer", "manual"];

const ISSUE_LABELS: Record<PayoutIssueType, string> = {
  damaged: "Damaged parcel",
  lost: "Lost package",
  delayed: "Delayed delivery",
  missing_items: "Missing items",
  fraud: "Suspected fraud",
  other: "Other issue",
};
const DISPUTE_LABELS: Record<PayoutDisputeReason, string> = {
  underpaid: "Underpaid amount",
  incorrect_amount: "Incorrect amount",
  missing_deliveries: "Missing deliveries",
  fraud: "Suspected fraud",
  other: "Other dispute",
};

/** Per-cycle row stores — mutations mutate them so subsequent reads stay consistent. */
const rowStores = new Map<string, PayoutRow[]>();
/** Per-cycle dispute stores keyed by courier id — seeded for withheld/flagged rows. */
const disputeStores = new Map<string, Map<string, PayoutDispute[]>>();
/** Settlement stamps — mark-as-paid writes here so the drawer's "Paid …" line persists. */
const paidAtStores = new Map<string, Map<string, string>>();

function rowsFor(cycle: string): PayoutRow[] {
  let rows = rowStores.get(cycle);
  if (!rows) {
    rows = payoutRowsFor(cycle);
    rowStores.set(cycle, rows);
  }
  return rows;
}

function disputesFor(cycle: string, row: PayoutRow): PayoutDispute[] {
  let store = disputeStores.get(cycle);
  if (!store) {
    store = new Map();
    disputeStores.set(cycle, store);
  }
  let disputes = store.get(row.courierId);
  if (!disputes) {
    disputes = seededDisputes(row, cycle);
    store.set(row.courierId, disputes);
  }
  return disputes;
}

function findRow(cycle: string, courierId: string, path: string) {
  const rows = rowsFor(cycle);
  const index = rows.findIndex((row) => row.courierId === courierId);
  if (index < 0) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
  return {rows, index};
}

function applyFilters(rows: PayoutRow[], params: PayoutListParams) {
  const q = params.query?.trim().toLowerCase();
  let items = rows;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (q) items = items.filter((row) => [row.courierId, row.name, row.bankName, row.accountNumber].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function metricsFor(rows: PayoutRow[], cycle: string): PayoutMetrics {
  const sum = (status: PayoutStatus) => rows.filter((row) => row.status === status).reduce((acc, row) => acc + row.netPayout, 0);
  const count = (status: PayoutStatus) => rows.filter((row) => row.status === status).length;
  const withheldIssues = rows
    .filter((row) => row.status === "withheld")
    .reduce((acc, row) => acc + disputesFor(cycle, row).filter((d) => d.status !== "resolved").length, 0);
  return {
    totalPayout: rows.reduce((acc, row) => acc + row.netPayout, 0),
    courierCount: rows.length,
    paidAmount: sum("paid"),
    paidCouriers: count("paid"),
    notPaidAmount: sum("not_paid"),
    awaitingTransfer: count("not_paid"),
    withheldAmount: sum("withheld"),
    withheldCouriers: count("withheld"),
    withheldIssues,
  };
}

function issuesSummary(rows: PayoutRow[], cycle: string, status: "withheld" | "flagged"): PayoutIssuesSummary {
  const matching = rows.filter((row) => row.status === status);
  const items = matching.slice(0, CARD_PREVIEW_COUNT).map((row) => {
    const unresolved = disputesFor(cycle, row).filter((d) => d.status !== "resolved");
    return {
      id: unresolved[0]?.id ?? `${status}-${row.courierId}`,
      courierId: row.courierId,
      courierName: row.name,
      issueCount: unresolved.length,
      issueLabel: unresolved[0]?.title ?? "",
      amount: row.netPayout,
    };
  });
  return {
    unresolvedCount: matching.reduce((acc, row) => acc + disputesFor(cycle, row).filter((d) => d.status !== "resolved").length, 0),
    heldAmount: matching.reduce((acc, row) => acc + row.netPayout, 0),
    items,
  };
}

function listResponse(params: PayoutListParams): PayoutListResponse {
  const rows = rowsFor(params.cycle);
  const items = applyFilters(rows, params);
  const start = (params.page - 1) * PAGE_SIZE;
  return {
    metrics: metricsFor(rows, params.cycle),
    payouts: {items: items.slice(start, start + PAGE_SIZE), page: params.page, pageSize: PAGE_SIZE, total: items.length},
    withheld: issuesSummary(rows, params.cycle, "withheld"),
    flagged: issuesSummary(rows, params.cycle, "flagged"),
    cycles: PAYOUT_CYCLES,
    filters: {statuses: STATUS_FILTERS},
    issueTypes: ISSUE_TYPES,
    disputeReasons: DISPUTE_REASONS,
    paymentMethods: PAYMENT_METHODS,
  };
}

function detailFor(cycle: string, row: PayoutRow): PayoutDetail {
  const paidAt = paidAtStores.get(cycle)?.get(row.courierId) ?? seededPaidAt(row, cycle);
  return payoutDetailFor(row, disputesFor(cycle, row), paidAt);
}

let disputeSeq = 5000;

function toCsv(rows: PayoutRow[]) {
  const header = "courier_id,name,account_number,bank_name,deliveries,net_payout,status";
  const body = rows.map((row) =>
    [row.courierId, row.name, row.accountNumber, row.bankName, row.deliveries, row.netPayout, row.status].join(",")
  );
  return [header, ...body].join("\n");
}

/** In-memory stand-in for the courier payout API while it does not exist. */
export const mockPayoutsService: PayoutsService = {
  getPayouts: async (params) => {
    await mockDelay();
    return listResponse(params);
  },

  getPayoutDetail: async (courierId, cycle) => {
    await mockDelay();
    const {rows, index} = findRow(cycle, courierId, `payouts/${cycle}/${courierId}`);
    return detailFor(cycle, rows[index]);
  },

  getPayoutDeliveries: async (courierId, cycle, params) => {
    await mockDelay();
    const {rows, index} = findRow(cycle, courierId, `payouts/${cycle}/${courierId}/deliveries`);
    const all = payoutDeliveriesFor(rows[index], cycle);
    const q = params.query?.trim().toLowerCase();
    let items = all;
    if (params.type) items = items.filter((row) => row.type === params.type);
    if (params.status) items = items.filter((row) => row.status === params.status);
    if (q) items = items.filter((row) => [row.id, row.type, row.pickup, row.dropoff].some((f) => f.toLowerCase().includes(q)));
    const start = (params.page - 1) * DELIVERIES_PAGE_SIZE;
    return {
      deliveries: {
        items: items.slice(start, start + DELIVERIES_PAGE_SIZE),
        page: params.page,
        pageSize: DELIVERIES_PAGE_SIZE,
        total: items.length,
      },
      totalEarned: all.filter((row) => row.status === "completed").reduce((acc, row) => acc + row.earned, 0),
    };
  },

  markPayoutsPaid: async (input) => {
    await mockDelay();
    let stamps = paidAtStores.get(input.cycle);
    if (!stamps) {
      stamps = new Map();
      paidAtStores.set(input.cycle, stamps);
    }
    for (const courierId of input.courierIds) {
      const {rows, index} = findRow(input.cycle, courierId, "payouts/mark-paid");
      rows[index] = {...rows[index], status: "paid"};
      stamps.set(courierId, input.paymentDate);
    }
    return {ids: input.courierIds, status: "paid"};
  },

  withholdPayout: async (courierId, input) => {
    await mockDelay();
    const {rows, index} = findRow(input.cycle, courierId, `payouts/${courierId}/withhold`);
    rows[index] = {...rows[index], status: "withheld"};
    disputesFor(input.cycle, rows[index]).unshift({
      id: `DSP-${disputeSeq++}`,
      parcelId: input.parcelId,
      title: ISSUE_LABELS[input.issueType],
      status: "open",
      description: input.description,
      date: new Date().toISOString().slice(0, 10),
    });
    return {id: courierId, status: "withheld"};
  },

  flagPayout: async (courierId, input) => {
    await mockDelay();
    const {rows, index} = findRow(input.cycle, courierId, `payouts/${courierId}/flag`);
    rows[index] = {...rows[index], status: "flagged"};
    disputesFor(input.cycle, rows[index]).unshift({
      id: `DSP-${disputeSeq++}`,
      parcelId: `PRC-${1000 + (disputeSeq % 9000)}`,
      title: DISPUTE_LABELS[input.disputeReason],
      status: "investigating",
      description: input.details,
      date: new Date().toISOString().slice(0, 10),
    });
    return {id: courierId, status: "flagged"};
  },

  exportPayouts: async (params) => {
    await mockDelay();
    const rows = rowsFor(params.cycle);
    const items = params.ids?.length
      ? rows.filter((row) => params.ids?.includes(row.courierId))
      : applyFilters(rows, {cycle: params.cycle, query: params.query, status: params.status, page: 1});
    return toCsv(items);
  },
};
