import {koboToNaira} from "@/lib/money";
import {toE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import {getSme} from "@/services/session";
import type {ApiCreateBatchRequest, ApiCreateBatchResponse, ApiListNodesResponse, ApiShipmentRow} from "@/types/api-types";
import type {ShipmentService} from "@/types/shipment-types";

const SIZE_CLASS: Record<string, string> = {S: "SIZE_CLASS_SMALL", M: "SIZE_CLASS_MEDIUM", B: "SIZE_CLASS_LARGE"};
const SPEED_TIER: Record<string, string> = {standard: "SPEED_TIER_STANDARD", express: "SPEED_TIER_EXPRESS"};

/**
 * Single-shipment/bulk create against `v1/nodes` and `v1/sme/batches`. The wire rows take a
 * destination node *code*, so the locker id→code mapping is fetched at submit time. The
 * `online` payment method and per-row fragile/item fields have no app input yet.
 */
export const httpShipmentService: ShipmentService = {
  getLockers: async () => {
    const res = await apiClient.get("v1/nodes").json<ApiListNodesResponse>();
    return res.nodes.map((n) => ({id: n.id, name: n.name}));
  },
  createBatch: async (input) => {
    const {nodes} = await apiClient.get("v1/nodes").json<ApiListNodesResponse>();
    const codeOf = (id: string) => nodes.find((n) => n.id === id)?.code ?? id;
    const rows: ApiShipmentRow[] = input.recipients.map((r) => ({
      recipientPhone: toE164(r.phone),
      destNodeCode: codeOf(r.lockerId),
      sizeClass: SIZE_CLASS[r.size],
      speedTier: SPEED_TIER[r.priority],
      recipientName: r.name || undefined,
    }));
    const body: ApiCreateBatchRequest = {
      originNodeId: input.originLockerId ?? "",
      fileName: input.name ?? "",
      rows,
    };
    const res = await apiClient.post("v1/sme/batches", {json: body}).json<ApiCreateBatchResponse>();
    return {
      batchId: res.batch.id,
      shipmentCount: res.shipments.length,
      totalPaid: koboToNaira(res.batch.totalPriceKobo),
      estimatedDelivery: "",
      receiptEmail: getSme()?.workEmail ?? "",
    };
  },
};
