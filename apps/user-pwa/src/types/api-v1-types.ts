/**
 * Wire DTOs for `v1/nodes`, `v1/orders`, `v1/wallet`, `v1/me` and `v1/notifications`.
 * Split from api-types to stay under the file-size lint; import either path.
 */

export interface ApiErrorBody {
  code?: number;
  message?: string;
}

export interface ApiUser {
  id: string;
  phone: string;
  email: string;
  name: string;
  preferredName: string;
  status: string;
  kycTier: string;
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

/* ---------- nodes ---------- */

export interface ApiNodeCapacity {
  small: number;
  medium: number;
  large: number;
}

export interface ApiNode {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  accessNotes: string;
  hours: string;
  status: string;
  capacity: ApiNodeCapacity;
  adapterType: string;
  /** Free slots per size right now. */
  available: ApiNodeCapacity;
  /** Set only when the list request carried lat/lng. */
  distanceM?: number;
}

export interface ApiListNodesResponse {
  nodes: ApiNode[];
}

export interface ApiGetNodeResponse {
  node: ApiNode;
}

/* ---------- orders ---------- */

export type ApiSizeClass = "SIZE_CLASS_SMALL" | "SIZE_CLASS_MEDIUM" | "SIZE_CLASS_LARGE";
export type ApiSpeedTier = "SPEED_TIER_STANDARD" | "SPEED_TIER_SAME_DAY" | "SPEED_TIER_EXPRESS";
export type ApiCodeWindow = "CODE_WINDOW_DROPOFF" | "CODE_WINDOW_PICKUP";

export interface ApiArrivalWindow {
  earliestAt: string;
  latestAt: string;
}

export interface ApiQuoteLine {
  kind: string;
  amountKobo: string;
}

export interface ApiGetQuoteRequest {
  sizeClass: ApiSizeClass;
  fragile: boolean;
  speedTier: ApiSpeedTier;
  originNodeId?: string;
  destNodeId?: string;
}

export interface ApiGetQuoteResponse {
  priceKobo: string;
  lines: ApiQuoteLine[];
  eta?: ApiArrivalWindow;
}

export interface ApiParcel {
  id: string;
  trackingNo: string;
  state: string;
  sizeClass: string;
  fragile: boolean;
  speedTier: string;
  priceKobo: string;
  originNodeId: string;
  destNodeId: string;
  recipientRef: string;
  createdAt: string;
  eta?: ApiArrivalWindow;
  recipientName?: string;
  itemDescription?: string;
  itemValueKobo?: string;
}

export interface ApiParcelEvent {
  fromState: string;
  toState: string;
  actorType: string;
  createdAt: string;
}

export interface ApiListParcelsResponse {
  parcels: ApiParcel[];
  nextCursor: string;
}

export interface ApiGetParcelResponse {
  parcel: ApiParcel;
  events: ApiParcelEvent[];
  codeExpiresAt: string;
}

export interface ApiCreateBookingRequest {
  originNodeId: string;
  destNodeId: string;
  sizeClass: ApiSizeClass;
  fragile: boolean;
  speedTier: ApiSpeedTier;
  recipientPhone: string;
  recipientName?: string;
  itemDescription?: string;
  itemValueKobo?: string;
}

export interface ApiCreateBookingResponse {
  parcel: ApiParcel;
  /** Returned exactly once — stored hashed server-side. */
  dropoffCode: string;
  codeExpiresAt: string;
}

export interface ApiExtensionQuoteResponse {
  /** True when the code lapsed — the change is a reactivation, not an extension. */
  reactivate: boolean;
  addedHours: number;
  feeKobo: string;
  freeExtensionsLeft: number;
  newExpiresAt: string;
}

export interface ApiWindowChange {
  /** The new drop-off code, returned once; empty for the pickup window. */
  dropoffCode?: string;
  codeExpiresAt: string;
  feeKobo: string;
  freeExtensionsLeft: number;
}

export interface ApiExtendWindowRequest {
  window: ApiCodeWindow;
  expectedFeeKobo: string;
}

export interface ApiExtendWindowResponse {
  change: ApiWindowChange;
}

export type ApiReactivateCodeResponse = ApiExtendWindowResponse;

export interface ApiUpgradeQuoteResponse {
  feeKobo: string;
}

export interface ApiPayUpgradeRequest {
  sizeClass: ApiSizeClass;
  expectedFeeKobo: string;
}

export interface ApiCancelBookingResponse {
  parcel: ApiParcel;
  refundedKobo: string;
}

export interface ApiTrackParcelResponse {
  parcel: ApiParcel;
  events: ApiParcelEvent[];
  codeExpiresAt: string;
}

export interface ApiRevealPickupCodeResponse {
  pickupCode: string;
  expiresAt: string;
}

/* ---------- wallet ---------- */

export interface ApiWallet {
  id: string;
  balanceKobo: string;
  currency: string;
  status: string;
  availableKobo: string;
}

export interface ApiVirtualAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface ApiGetWalletResponse {
  wallet: ApiWallet;
  /** Unset until the user generates a dedicated account. */
  virtualAccount?: ApiVirtualAccount;
}

export interface ApiTransaction {
  id: string;
  journalType: string;
  kind: string;
  /** Signed kobo — credits positive, debits negative. */
  amountKobo: string;
  reference: string;
  trackingNo?: string;
  createdAt: string;
}

export interface ApiListTransactionsResponse {
  transactions: ApiTransaction[];
  nextCursor: string;
}

export interface ApiCheckout {
  reference: string;
  authorizationUrl: string;
  amountKobo: string;
  status: string;
}

export interface ApiInitializeCheckoutResponse {
  checkout: ApiCheckout;
}

/* ---------- profile / account ---------- */

export interface ApiGetMeResponse {
  user: ApiUser;
}

export interface ApiUpdateProfileRequest {
  name?: string;
  preferredName?: string;
}

export interface ApiAddress {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface ApiListAddressesResponse {
  addresses: ApiAddress[];
}

export interface ApiPhoneChangeRequest {
  phone: string;
}

export interface ApiConfirmCodeRequest {
  code: string;
}

export interface ApiDeleteRequestBody {
  password: string;
}

export interface ApiDeleteAccountRequest {
  code: string;
}

/* ---------- notifications ---------- */

export interface ApiNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  parcelId?: string;
  readAt?: string;
  createdAt: string;
}

export interface ApiListNotificationsResponse {
  notifications: ApiNotification[];
  nextCursor: string;
}
