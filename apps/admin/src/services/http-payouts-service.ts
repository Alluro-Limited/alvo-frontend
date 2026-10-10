import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {PayoutsService} from "@/types/payouts-types";

const StatusSchema = v.picklist(["paid", "not_paid", "withheld", "flagged"]);
const IssueTypeSchema = v.picklist(["damaged", "lost", "delayed", "missing_items", "fraud", "other"]);
const DisputeReasonSchema = v.picklist(["underpaid", "incorrect_amount", "missing_deliveries", "fraud", "other"]);
const PaymentMethodSchema = v.picklist(["bank_transfer", "manual"]);

const PageSchema = <T extends v.GenericSchema>(item: T) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  courierId: v.string(),
  name: v.string(),
  photoUrl: v.nullable(v.string()),
  accountNumber: v.string(),
  bankName: v.string(),
  deliveries: v.number(),
  netPayout: v.number(),
  status: StatusSchema,
});

const IssueItemSchema = v.object({
  id: v.string(),
  courierId: v.string(),
  courierName: v.string(),
  issueCount: v.number(),
  issueLabel: v.string(),
  amount: v.number(),
});

const IssuesSchema = v.object({unresolvedCount: v.number(), heldAmount: v.number(), items: v.array(IssueItemSchema)});

const ListSchema = v.object({
  metrics: v.object({
    totalPayout: v.number(),
    courierCount: v.number(),
    paidAmount: v.number(),
    paidCouriers: v.number(),
    notPaidAmount: v.number(),
    awaitingTransfer: v.number(),
    withheldAmount: v.number(),
    withheldCouriers: v.number(),
    withheldIssues: v.number(),
  }),
  payouts: PageSchema(RowSchema),
  withheld: IssuesSchema,
  flagged: IssuesSchema,
  cycles: v.array(v.object({id: v.string(), label: v.string()})),
  filters: v.object({statuses: v.array(StatusSchema)}),
  issueTypes: v.array(IssueTypeSchema),
  disputeReasons: v.array(DisputeReasonSchema),
  paymentMethods: v.array(PaymentMethodSchema),
});

const DetailSchema = v.object({
  courierId: v.string(),
  name: v.string(),
  photoUrl: v.nullable(v.string()),
  status: StatusSchema,
  deliveriesCompleted: v.number(),
  grossEarnings: v.number(),
  netPayout: v.number(),
  bank: v.object({bankName: v.string(), accountNumber: v.string(), accountHolder: v.string()}),
  disputes: v.array(
    v.object({
      id: v.string(),
      parcelId: v.string(),
      title: v.string(),
      status: v.picklist(["open", "investigating", "resolved"]),
      description: v.string(),
      date: v.string(),
    })
  ),
  paidAt: v.nullable(v.string()),
});

const DeliveriesSchema = v.object({
  deliveries: PageSchema(
    v.object({
      date: v.string(),
      id: v.string(),
      type: v.picklist(["bulk", "node", "express"]),
      pickup: v.string(),
      dropoff: v.string(),
      earned: v.number(),
      items: v.number(),
      status: v.picklist(["completed", "cancelled", "failed"]),
    })
  ),
  totalEarned: v.number(),
});

const PaidResultSchema = v.object({ids: v.array(v.string()), status: StatusSchema});
const MutationResultSchema = v.object({id: v.string(), status: StatusSchema});

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpPayoutsService: PayoutsService = {
  getPayouts: async (params) => {
    const body = await apiClient
      .get("payouts", {searchParams: {cycle: params.cycle, page: params.page, query: params.query ?? "", status: params.status ?? ""}})
      .json();
    return v.parse(ListSchema, body);
  },

  getPayoutDetail: async (courierId, cycle) => {
    const body = await apiClient.get(`payouts/${cycle}/${courierId}`).json();
    return v.parse(DetailSchema, body);
  },

  getPayoutDeliveries: async (courierId, cycle, params) => {
    const body = await apiClient
      .get(`payouts/${cycle}/${courierId}/deliveries`, {
        searchParams: {page: params.page, query: params.query ?? "", type: params.type ?? "", status: params.status ?? ""},
      })
      .json();
    return v.parse(DeliveriesSchema, body);
  },

  markPayoutsPaid: async (input) => {
    const body = await apiClient
      .post("payouts/mark-paid", {
        json: {
          cycle: input.cycle,
          courierIds: input.courierIds,
          paymentMethod: input.paymentMethod,
          paymentDate: input.paymentDate,
          remarks: input.remarks,
        },
      })
      .json();
    return v.parse(PaidResultSchema, body);
  },

  withholdPayout: async (courierId, input) => {
    const body = await apiClient
      .post(`payouts/${courierId}/withhold`, {
        json: {
          cycle: input.cycle,
          parcelId: input.parcelId,
          issueType: input.issueType,
          amountAtRisk: input.amountAtRisk,
          description: input.description,
        },
      })
      .json();
    return v.parse(MutationResultSchema, body);
  },

  flagPayout: async (courierId, input) => {
    const body = await apiClient
      .post(`payouts/${courierId}/flag`, {json: {cycle: input.cycle, disputeReason: input.disputeReason, details: input.details}})
      .json();
    return v.parse(MutationResultSchema, body);
  },

  exportPayouts: async (params) => {
    return apiClient
      .get("payouts/export", {
        searchParams: {
          cycle: params.cycle,
          query: params.query ?? "",
          status: params.status ?? "",
          ids: params.ids?.join(",") ?? "",
        },
      })
      .text();
  },
};
