import type {ShipmentPriority, ShipmentSize} from "./dashboard-types";

export type PaymentMethod = "wallet" | "online";

export type ShipmentMode = "single" | "bulk";

/** A destination locker as it appears in the form's select, e.g. "Lekki Hub - PR14". */
export interface Locker {
  id: string;
  name: string;
}

/** One row of the single-shipment form. */
export interface ShipmentRecipient {
  name: string;
  phone: string;
  lockerId: string;
  size: ShipmentSize;
  priority: ShipmentPriority;
}

export interface CreateBatchInput {
  recipients: ShipmentRecipient[];
  method: PaymentMethod;
  name?: string;
  notes?: string;
  originLockerId?: string;
}

export interface CreateBatchResult {
  batchId: string;
  shipmentCount: number;
  totalPaid: number;
  estimatedDelivery: string;
  receiptEmail: string;
}

export interface ShipmentService {
  getLockers: () => Promise<Locker[]>;
  createBatch: (input: CreateBatchInput) => Promise<CreateBatchResult>;
}
