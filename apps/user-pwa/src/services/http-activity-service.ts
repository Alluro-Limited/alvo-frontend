import {mapError} from "@/lib/api-errors";
import {saveDropoffCode} from "@/lib/booking-codes";
import {formatDateTime} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {NEXT_SIZE, toActivityItem, toDeliveryDetail} from "@/services/activity-map";
import {apiClient} from "@/services/api-client";
import type {
  ApiCancelBookingResponse,
  ApiCodeWindow,
  ApiExtendWindowRequest,
  ApiExtendWindowResponse,
  ApiExtensionQuoteResponse,
  ApiGetNodeResponse,
  ApiGetParcelResponse,
  ApiListParcelsResponse,
  ApiParcel,
  ApiPayUpgradeRequest,
  ApiRevealPickupCodeResponse,
} from "@/types/api-types";
import type {ActivityService} from "@/types/activity-types";

const getNode = (id: string) =>
  apiClient
    .get(`v1/nodes/${id}`)
    .json<ApiGetNodeResponse>()
    .then((res) => res.node)
    .catch(() => null);

const extensionQuote = (id: string, window: ApiCodeWindow) =>
  apiClient
    .get(`v1/parcels/${id}/extension-quote`, {searchParams: {window}})
    .json<ApiExtensionQuoteResponse>()
    .catch(() => null);

const toPreview = (quote: ApiExtensionQuoteResponse | null) => ({
  addedTime: quote ? `+${quote.addedHours} Hours` : "",
  newDeadline: quote ? formatDateTime(quote.newExpiresAt) : "",
  fee: koboToNaira(quote?.feeKobo),
});

/** Extends or — when the quote says the code lapsed — reactivates the window. */
const changeWindow = async (id: string, window: ApiCodeWindow, quote: ApiExtensionQuoteResponse | null) => {
  const body: ApiExtendWindowRequest = {window, expectedFeeKobo: quote?.feeKobo ?? "0"};
  const path = quote?.reactivate ? `v1/parcels/${id}/reactivate` : `v1/parcels/${id}/extend`;
  const res = await apiClient.post(path, {json: body}).json<ApiExtendWindowResponse>();
  // A drop-off window change mints a new one-time code; keep it for the Access view.
  if (res.change.dropoffCode) saveDropoffCode(id, res.change.dropoffCode);
  return res.change;
};

const trackingNo = async (id: string) => {
  const {parcel} = await apiClient.get(`v1/parcels/${id}`).json<ApiGetParcelResponse>();
  return encodeURIComponent(parcel.trackingNo);
};

/**
 * Activities against `v1/parcels/**`. Gaps the wire can't fill yet: the pickup location's
 * locker number and tracking telemetry (map, distance, duration) have no fields, the
 * recipient's phone/note stay sealed, and a pending locker upgrade isn't detectable.
 */
export const httpActivityService: ActivityService = {
  getActivities: async () => {
    const parcels: ApiParcel[] = [];
    let cursor = "";
    do {
      const res = await apiClient.get("v1/parcels", {searchParams: {limit: 50, cursor}}).json<ApiListParcelsResponse>();
      parcels.push(...res.parcels);
      cursor = res.nextCursor;
    } while (cursor);
    return parcels.map(toActivityItem);
  },
  getDelivery: async (id) => {
    const detail = await apiClient
      .get(`v1/parcels/${id}`)
      .json<ApiGetParcelResponse>()
      .catch(mapError({404: "not_found"}));
    const [origin, dest, pickupQuote, dropoffQuote] = await Promise.all([
      getNode(detail.parcel.originNodeId),
      getNode(detail.parcel.destNodeId),
      extensionQuote(id, "CODE_WINDOW_PICKUP"),
      extensionQuote(id, "CODE_WINDOW_DROPOFF"),
    ]);
    return toDeliveryDetail(detail, {origin, dest, pickupQuote, dropoffQuote});
  },
  previewDropoffExtension: async (id) => toPreview(await extensionQuote(id, "CODE_WINDOW_DROPOFF")),
  extendDropoff: async (id) => {
    const quote = await extensionQuote(id, "CODE_WINDOW_DROPOFF");
    const change = await changeWindow(id, "CODE_WINDOW_DROPOFF", quote);
    return {
      newDeadline: formatDateTime(change.codeExpiresAt),
      lockerNode: "",
      status: quote?.reactivate ? "Access Code Reactivated" : "Drop-off Extended",
    };
  },
  previewPickupExtension: async (id) => toPreview(await extensionQuote(id, "CODE_WINDOW_PICKUP")),
  reactivatePickup: async (id) => {
    const quote = await extensionQuote(id, "CODE_WINDOW_PICKUP");
    const change = await changeWindow(id, "CODE_WINDOW_PICKUP", quote);
    return {newDeadline: formatDateTime(change.codeExpiresAt), lockerNode: "", status: "Access Code Reactivated"};
  },
  upgradeLocker: async (id) => {
    const {parcel} = await apiClient.get(`v1/parcels/${id}`).json<ApiGetParcelResponse>();
    const sizeClass = NEXT_SIZE[parcel.sizeClass];
    if (!sizeClass) return;
    const quote = await apiClient
      .get(`v1/parcels/${id}/upgrade-quote`, {searchParams: {size_class: sizeClass}})
      .json<ApiExtensionQuoteResponse>();
    const body: ApiPayUpgradeRequest = {sizeClass, expectedFeeKobo: quote.feeKobo};
    await apiClient.post(`v1/parcels/${id}/upgrade`, {json: body});
  },
  cancelShipment: async (id) => {
    await apiClient.post(`v1/parcels/${id}/cancel`).json<ApiCancelBookingResponse>();
  },
  sendPickupVerification: async (id) => {
    await apiClient.post(`v1/track/${await trackingNo(id)}/pickup-code/request`);
  },
  trackParcel: async (trackingNo) => {
    const detail = await apiClient.get(`v1/track/${encodeURIComponent(trackingNo)}`).json<ApiGetParcelResponse>();
    const [origin, dest, pickupQuote, dropoffQuote] = await Promise.all([
      getNode(detail.parcel.originNodeId),
      getNode(detail.parcel.destNodeId),
      extensionQuote(detail.parcel.id, "CODE_WINDOW_PICKUP"),
      extensionQuote(detail.parcel.id, "CODE_WINDOW_DROPOFF"),
    ]);
    return toDeliveryDetail(detail, {origin, dest, pickupQuote, dropoffQuote});
  },
  verifyPickup: async (id, code) => {
    const res = await apiClient
      .post(`v1/track/${await trackingNo(id)}/pickup-code`, {json: {code}})
      .json<ApiRevealPickupCodeResponse>()
      .catch(mapError({400: "invalid_code"}));
    return res.pickupCode;
  },
};
