/**
 * Wire DTOs for the Alvo API (`/v1/**`). The gateway speaks proto3 JSON: lowerCamelCase
 * fields in and out, int64 money as decimal strings, `google.rpc.Status` errors.
 */

export interface ApiSme {
  id: string;
  businessName: string;
  workEmail: string;
  tier: string;
  status: string;
  createdAt: string;
}

export interface ApiRegisterSmeRequest {
  businessName: string;
  workEmail: string;
  password: string;
}

export interface ApiSignInSmeRequest {
  workEmail: string;
  password: string;
}

export interface ApiSmeAuthResponse {
  sme: ApiSme;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiRequestOtpRequest {
  identifier: string;
  channel: string;
}

export interface ApiVerifyOtpRequest {
  identifier: string;
  code: string;
}

export interface ApiNode {
  id: string;
  code: string;
  name: string;
  status: string;
}

export interface ApiListNodesResponse {
  nodes: ApiNode[];
}

export interface ApiShipmentRow {
  recipientPhone: string;
  destNodeCode: string;
  sizeClass: string;
  fragile?: boolean;
  speedTier: string;
  recipientName?: string;
  itemDescription?: string;
  itemValueKobo?: string;
}

export interface ApiCreateBatchRequest {
  originNodeId: string;
  fileName: string;
  rows: ApiShipmentRow[];
}

export interface ApiBatch {
  id: string;
  fileName: string;
  totalParcels: number;
  totalPriceKobo: string;
  status: string;
  createdAt: string;
}

export interface ApiShipment {
  trackingNo: string;
  recipientPhone: string;
  recipientName?: string;
  itemDescription?: string;
  sizeClass: string;
  speedTier?: string;
  state: string;
  priceKobo: string;
}

export interface ApiCreatedShipment {
  parcelId: string;
  trackingNo: string;
  dropoffCode: string;
  priceKobo: string;
}

export interface ApiListBatchesResponse {
  batches: ApiBatch[];
  nextCursor?: string;
}

export interface ApiGetBatchResponse {
  batch: ApiBatch;
  shipments: ApiShipment[];
}

export interface ApiCreateBatchResponse {
  batch: ApiBatch;
  shipments: ApiCreatedShipment[];
}

export interface ApiSmeWallet {
  balanceKobo: string;
  availableKobo?: string;
}

export interface ApiGetSmeWalletResponse {
  wallet: ApiSmeWallet;
}

export interface ApiSmeTransaction {
  id: string;
  kind: string;
  amountKobo: string;
  batchId?: string;
  createdAt: string;
}

export interface ApiListSmeTransactionsResponse {
  transactions: ApiSmeTransaction[];
  nextCursor?: string;
}

export interface ApiNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
}

export interface ApiListNotificationsResponse {
  notifications: ApiNotification[];
  nextCursor: string;
}
