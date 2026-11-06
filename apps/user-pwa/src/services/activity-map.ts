import {getDropoffCode} from "@/lib/booking-codes";
import {dayKey, formatDateTime, formatEta, formatRemaining, formatShortDateTime} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import type {ApiExtensionQuoteResponse, ApiGetParcelResponse, ApiNode, ApiParcel, ApiParcelEvent, ApiSizeClass} from "@/types/api-types";
import type {AccessCode, ActivityItem, DeliveryDetail, DeliveryStatus, TimelineEvent} from "@/types/activity-types";

const STATE_STATUS: Record<string, DeliveryStatus> = {
  PARCEL_STATE_CREATED: "pending",
  PARCEL_STATE_PAID: "booked",
  PARCEL_STATE_CODE_ISSUED: "booked",
  PARCEL_STATE_AT_ORIGIN: "dropped",
  PARCEL_STATE_IN_TRANSIT: "enroute",
  // There is no "arrived" pill — the detail still unlocks the pickup code at this state.
  PARCEL_STATE_AT_DEST: "enroute",
  PARCEL_STATE_COLLECTED: "collected",
  PARCEL_STATE_EXPIRED: "expired",
  PARCEL_STATE_CANCELLED: "cancelled",
  PARCEL_STATE_RETURN_PENDING: "enroute",
  PARCEL_STATE_RETURNED: "complete",
};

const STATE_MESSAGE: Record<string, string> = {
  PARCEL_STATE_CREATED: "Awaiting drop-off at the origin locker",
  PARCEL_STATE_PAID: "Awaiting drop-off at the origin locker",
  PARCEL_STATE_CODE_ISSUED: "Awaiting drop-off at the origin locker",
  PARCEL_STATE_AT_ORIGIN: "Dropped off at the origin locker",
  PARCEL_STATE_IN_TRANSIT: "On the way to destination locker",
  PARCEL_STATE_AT_DEST: "Ready for pickup at the destination locker",
  PARCEL_STATE_COLLECTED: "Collected by the recipient",
  PARCEL_STATE_EXPIRED: "Access code expired",
  PARCEL_STATE_CANCELLED: "Booking cancelled",
  PARCEL_STATE_RETURN_PENDING: "Being returned to sender",
  PARCEL_STATE_RETURNED: "Returned to sender",
};

const STATE_PROGRESS: Record<string, number> = {
  PARCEL_STATE_CREATED: 0,
  PARCEL_STATE_PAID: 1,
  PARCEL_STATE_CODE_ISSUED: 1,
  PARCEL_STATE_AT_ORIGIN: 2,
  PARCEL_STATE_IN_TRANSIT: 3,
  PARCEL_STATE_AT_DEST: 3.5,
  PARCEL_STATE_COLLECTED: 4,
};

const EVENT_LABEL: Record<string, string> = {
  PARCEL_STATE_CREATED: "Booked",
  PARCEL_STATE_PAID: "Paid",
  PARCEL_STATE_CODE_ISSUED: "Access code issued",
  PARCEL_STATE_AT_ORIGIN: "Dropped off",
  PARCEL_STATE_IN_TRANSIT: "In transit",
  PARCEL_STATE_AT_DEST: "Ready for pickup",
  PARCEL_STATE_COLLECTED: "Collected",
  PARCEL_STATE_EXPIRED: "Code expired",
  PARCEL_STATE_CANCELLED: "Cancelled",
  PARCEL_STATE_RETURN_PENDING: "Return started",
  PARCEL_STATE_RETURNED: "Returned",
};

const SIZE_LABEL: Record<string, string> = {
  SIZE_CLASS_SMALL: "Small",
  SIZE_CLASS_MEDIUM: "Medium",
  SIZE_CLASS_LARGE: "Large",
};

const SPEED_LABEL: Record<string, string> = {
  SPEED_TIER_STANDARD: "Standard",
  SPEED_TIER_SAME_DAY: "Same Day",
  SPEED_TIER_EXPRESS: "Express",
};

export const NEXT_SIZE: Record<string, ApiSizeClass> = {
  SIZE_CLASS_SMALL: "SIZE_CLASS_MEDIUM",
  SIZE_CLASS_MEDIUM: "SIZE_CLASS_LARGE",
};

const isExpired = (state: string, expiresAt: string) => state === "PARCEL_STATE_EXPIRED" || Date.parse(expiresAt) < Date.now();

const atDestination = (state: string) => ["PARCEL_STATE_AT_DEST", "PARCEL_STATE_COLLECTED", "PARCEL_STATE_EXPIRED"].includes(state);

const toAccessCode = (opts: {code: string; expiresAt: string; expired: boolean; locked: boolean}): AccessCode => ({
  code: opts.code,
  validUntil: formatDateTime(opts.expiresAt),
  remaining: formatRemaining(opts.expiresAt),
  expired: opts.expired,
  protected: opts.locked,
});

const toTimeline = (events: ApiParcelEvent[]): TimelineEvent[] =>
  events.map((event) => ({
    label: EVENT_LABEL[event.toState] ?? event.toState,
    time: formatShortDateTime(event.createdAt),
    sub: null,
    done: true,
  }));

const toInfo = (parcel: ApiParcel): DeliveryDetail["info"] => ({
  size: SIZE_LABEL[parcel.sizeClass] ?? "",
  contents: parcel.itemDescription ?? "",
  value: koboToNaira(parcel.itemValueKobo),
  recipient: parcel.recipientName ?? "",
  phone: "",
  note: "",
  speed: SPEED_LABEL[parcel.speedTier] ?? "",
});

const toTrack = (parcel: ApiParcel): DeliveryDetail["track"] => ({
  pickupTime: "",
  eta: parcel.eta ? formatDateTime(parcel.eta.earliestAt) : "",
  duration: "",
  distance: "",
  progress: 0,
});

export const toActivityItem = (parcel: ApiParcel): ActivityItem => ({
  id: parcel.id,
  kind: "package",
  refId: parcel.trackingNo,
  status: STATE_STATUS[parcel.state] ?? "pending",
  recipient: parcel.recipientName ?? "",
  amount: koboToNaira(parcel.priceKobo),
  eta: parcel.eta ? formatEta(parcel.eta.earliestAt) : "",
  day: dayKey(parcel.createdAt),
});

const upperName = (node: ApiNode | null): string => (node?.name ?? "").toUpperCase();

const pickupAccessFor = (parcel: ApiParcel, expiresAt: string, expired: boolean): AccessCode | null =>
  atDestination(parcel.state) ? toAccessCode({code: "", expiresAt, expired, locked: true}) : null;

const pickupLocationFor = (dest: ApiNode | null): DeliveryDetail["pickupLocation"] => ({
  node: dest?.name ?? "",
  locker: "",
  directions: dest?.accessNotes ?? "",
});

export interface DetailContext {
  origin: ApiNode | null;
  dest: ApiNode | null;
  pickupQuote: ApiExtensionQuoteResponse | null;
  dropoffQuote: ApiExtensionQuoteResponse | null;
}

export const toDeliveryDetail = (detail: ApiGetParcelResponse, ctx: DetailContext): DeliveryDetail => {
  const {parcel, events, codeExpiresAt} = detail;
  const expired = isExpired(parcel.state, codeExpiresAt);
  return {
    id: parcel.id,
    kind: "package",
    refId: parcel.trackingNo,
    origin: upperName(ctx.origin),
    destination: upperName(ctx.dest),
    status: STATE_STATUS[parcel.state] ?? "pending",
    statusMessage: STATE_MESSAGE[parcel.state] ?? "",
    updatedAt: formatShortDateTime(events[events.length - 1]?.createdAt ?? parcel.createdAt),
    progress: STATE_PROGRESS[parcel.state] ?? 0,
    amountPaid: koboToNaira(parcel.priceKobo),
    paymentMethod: "Wallet",
    paidAt: formatEta(parcel.createdAt),
    dropoffAccess: toAccessCode({code: getDropoffCode(parcel.id), expiresAt: codeExpiresAt, expired, locked: false}),
    pickupAccess: pickupAccessFor(parcel, codeExpiresAt, expired),
    pickupLocation: pickupLocationFor(ctx.dest),
    pickupExtensionFee: koboToNaira(ctx.pickupQuote?.feeKobo),
    extensionsRemaining: ctx.dropoffQuote?.freeExtensionsLeft ?? 0,
    lockerUpgrade: null,
    safe: null,
    storage: null,
    track: toTrack(parcel),
    info: toInfo(parcel),
    timeline: toTimeline(events),
  };
};
