import {saveDropoffCode} from "@/lib/booking-codes";
import {formatArrival, formatDateTime, formatDistance, formatRemaining} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {toE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import type {
  ApiCreateBookingRequest,
  ApiCreateBookingResponse,
  ApiGetNodeResponse,
  ApiGetQuoteRequest,
  ApiGetQuoteResponse,
  ApiGetWalletResponse,
  ApiListNodesResponse,
  ApiNode,
  ApiNodeCapacity,
  ApiSizeClass,
  ApiSpeedTier,
} from "@/types/api-types";
import type {DeliverySpeed, LockerNode, PackageSize, SendService} from "@/types/send-types";

const SIZE_CLASS: Record<PackageSize, ApiSizeClass> = {
  small: "SIZE_CLASS_SMALL",
  medium: "SIZE_CLASS_MEDIUM",
  large: "SIZE_CLASS_LARGE",
};

const SPEED_TIER: Record<DeliverySpeed, ApiSpeedTier> = {
  standard: "SPEED_TIER_STANDARD",
  same_day: "SPEED_TIER_SAME_DAY",
  express: "SPEED_TIER_EXPRESS",
};

const sizesLabel = (capacity: ApiNodeCapacity): string => {
  const sizes = [capacity.small > 0 && "Small", capacity.medium > 0 && "Medium", capacity.large > 0 && "Large"].filter(
    (s): s is string => s !== false
  );
  return sizes.length === 3 ? "All sizes" : sizes.join(" & ");
};

export const toLockerNode = (node: ApiNode): LockerNode => ({
  id: node.id,
  name: node.name,
  address: "",
  distance: node.distanceM !== undefined ? formatDistance(node.distanceM) : "",
  floor: "",
  access: [node.hours, node.accessNotes].filter(Boolean).join(" • "),
  status: node.status === "NODE_STATUS_AVAILABLE" ? "available" : "offline",
  sizes: sizesLabel(node.available ?? node.capacity),
});

const lineLabel = (kind: string, speed: DeliverySpeed): string => {
  if (kind === "QUOTE_LINE_KIND_FRAGILE") return "Fragile Handling:";
  if (kind === "QUOTE_LINE_KIND_SPEED") return speed === "same_day" ? "Same Day:" : "Express Delivery:";
  return "Base Delivery:";
};

/**
 * Send Securely against `v1/nodes`, `v1/quote` and `v1/bookings`. `service` (door-to-locker),
 * the `online` payment channel, and the recipient's email/note/saveToContacts have no API
 * fields yet and are dropped on the wire.
 */
export const httpSendService: SendService = {
  getNodes: async () => {
    const res = await apiClient.get("v1/nodes").json<ApiListNodesResponse>();
    return res.nodes.map(toLockerNode);
  },
  getQuote: async (input) => {
    const body: ApiGetQuoteRequest = {
      sizeClass: SIZE_CLASS[input.size],
      fragile: input.fragile,
      speedTier: SPEED_TIER[input.speed],
      originNodeId: input.originNodeId,
      destNodeId: input.destinationNodeId,
    };
    const [quote, wallet] = await Promise.all([
      apiClient.post("v1/quote", {json: body}).json<ApiGetQuoteResponse>(),
      apiClient.get("v1/wallet").json<ApiGetWalletResponse>(),
    ]);
    return {
      lines: quote.lines.map((line, i) => ({
        id: `${line.kind}-${i}`,
        label: lineLabel(line.kind, input.speed),
        amount: koboToNaira(line.amountKobo),
      })),
      total: koboToNaira(quote.priceKobo),
      arrival: quote.eta ? formatArrival(quote.eta.earliestAt) : "",
      walletBalance: koboToNaira(wallet.wallet.availableKobo),
    };
  },
  createBooking: async (request) => {
    const body: ApiCreateBookingRequest = {
      originNodeId: request.originNodeId,
      destNodeId: request.destinationNodeId,
      sizeClass: SIZE_CLASS[request.size],
      fragile: request.fragile,
      speedTier: SPEED_TIER[request.speed],
      recipientPhone: toE164(request.recipient.phone),
    };
    if (request.recipient.name) body.recipientName = request.recipient.name;
    if (request.contents) body.itemDescription = request.contents;
    const res = await apiClient.post("v1/bookings", {json: body}).json<ApiCreateBookingResponse>();

    saveDropoffCode(res.parcel.id, res.dropoffCode);
    if (request.favorite) void apiClient.put(`v1/me/favorite-nodes/${request.destinationNodeId}`).catch(() => {});

    const origin = await apiClient
      .get(`v1/nodes/${request.originNodeId}`)
      .json<ApiGetNodeResponse>()
      .catch(() => null);
    return {
      trackingNumber: res.parcel.trackingNo,
      dropOffCode: res.dropoffCode,
      dropOffLocation: origin ? [origin.node.name, origin.node.accessNotes].filter(Boolean).join(", ") : "",
      validUntil: formatDateTime(res.codeExpiresAt),
      remaining: formatRemaining(res.codeExpiresAt),
    };
  },
};
