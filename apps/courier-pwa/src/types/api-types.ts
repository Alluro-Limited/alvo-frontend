/**
 * Wire DTOs for the Alvo API (`/v1/**`). The gateway speaks proto3 JSON: lowerCamelCase
 * fields in and out, int64 money as decimal strings, `google.rpc.Status` errors.
 */

/* ---------- shared auth ---------- */

export interface ApiUser {
  id: string;
  phone: string;
  email: string;
  name: string;
  preferredName: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponse extends AuthTokensResponse {
  user: ApiUser;
}

export interface RequestOtpRequest {
  identifier: string;
  channel: string;
  scope?: string;
}

export interface ResendSecondsResponse {
  resendAfterSeconds: number;
}

export interface VerifyOtpRequest {
  identifier: string;
  code: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ApiGetMeResponse {
  user: ApiUser;
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
}

export interface ApiListNodesResponse {
  nodes: ApiNode[];
}

/* ---------- courier ---------- */

export interface ApiCourier {
  id: string;
  vehicleType: string;
  plate: string;
  areas: string[];
  verificationStatus: string;
}

export interface ApiGetCourierProfileResponse {
  courier: ApiCourier;
}

export interface ApiOnboardCourierRequest {
  vehicleType?: string;
  plate?: string;
  areas?: string[];
  bankAccountRef?: string;
}

export interface ApiGetHomeResponse {
  openOffers: number;
  acceptedJobs: number;
  todayEarningsKobo: string;
}

export interface ApiCourierJob {
  id: string;
  manifestId: string;
  state: string;
  earningsKobo: string;
  offeredAt: string;
  expiresAt: string;
}

export interface ApiListJobsResponse {
  jobs: ApiCourierJob[];
}

export interface ApiCourierParcel {
  trackingNo: string;
  sizeClass: string;
  fragile: boolean;
  destNodeId: string;
  destNodeName: string;
  state: string;
}

export interface ApiGetJobResponse {
  job: ApiCourierJob;
  parcels: ApiCourierParcel[];
}

export interface ApiScanParcelRequest {
  trackingNo: string;
  scanType: "SCAN_TYPE_PICKUP" | "SCAN_TYPE_DROPOFF";
  lat?: number;
  lng?: number;
}

export interface ApiScanParcelResponse {
  parcelId: string;
  trackingNo: string;
  state: string;
}

export interface ApiSetAvailabilityRequest {
  availability: "AVAILABILITY_ONLINE" | "AVAILABILITY_OFFLINE";
}

export interface ApiSetDeliveryAreaRequest {
  areas: string[];
}

export interface ApiEarningRow {
  jobId: string;
  earningsKobo: string;
  createdAt: string;
}

export interface ApiGetEarningsResponse {
  totalKobo: string;
  rows: ApiEarningRow[];
}

export interface ApiAnalyticsBucket {
  label: string;
  jobs: string;
  earningsKobo: string;
}

export interface ApiGetAnalyticsResponse {
  completedJobs: string;
  earningsKobo: string;
  buckets: ApiAnalyticsBucket[];
}

export interface ApiBank {
  code: string;
  name: string;
}

export interface ApiListBanksResponse {
  banks: ApiBank[];
}

export interface ApiGetBankAccountResponse {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface ApiSetBankAccountRequest {
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface ApiNotificationPref {
  key: string;
  enabled: boolean;
}

export interface ApiGetNotificationPrefsResponse {
  prefs: ApiNotificationPref[];
}

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

export interface ApiConfirmCodeRequest {
  code: string;
}
