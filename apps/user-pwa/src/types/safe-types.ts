import type {CostLine, LockerNode, PaymentChannel} from "@/types/send-types";

/** A storage node — same shape as a locker node plus the number of free safes (0 = fully booked). */
export interface SafeNode extends LockerNode {
  safes: number;
}

export type SafeSize = "small" | "medium" | "large";

export interface SafeSizeOption {
  id: SafeSize;
  label: string;
  /** e.g. "30x20x15cm" */
  dims: string;
  /** Naira per hour. */
  hourlyRate: number;
}

export interface SafeDuration {
  id: string;
  /** e.g. "4 Hours" */
  label: string;
  hours: number;
  /** e.g. "until 6:00 PM" — shown in the summary. */
  until: string;
}

export interface SafeOptions {
  sizes: SafeSizeOption[];
  durations: SafeDuration[];
}

export interface SafeQuoteInput {
  size: SafeSize;
  durationId: string;
}

export interface SafeQuote {
  lines: CostLine[];
  total: number;
  walletBalance: number;
}

export interface SafeReserveRequest {
  nodeId: string;
  size: SafeSize;
  durationId: string;
  storing: string;
  channel: PaymentChannel;
}

export interface SafeReservation {
  /** e.g. "STR9245" — rendered as #STR9245. */
  storageId: string;
  /** e.g. "Lekki Mall Locker Node, Ground Floor, Near Entrance 2" */
  location: string;
  validUntil: string;
  /** e.g. "3 hours 45 mins remaining" */
  remaining: string;
  accessCode: string;
}

export interface SafeService {
  getNodes(): Promise<SafeNode[]>;
  getOptions(): Promise<SafeOptions>;
  getQuote(input: SafeQuoteInput): Promise<SafeQuote>;
  reserve(request: SafeReserveRequest): Promise<SafeReservation>;
}
