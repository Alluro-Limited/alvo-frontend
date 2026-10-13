export type SendServiceType = "locker_to_locker" | "door_to_locker";
export type PackageSize = "small" | "medium" | "large";
export type DeliverySpeed = "standard" | "same_day" | "express";
export type PaymentChannel = "wallet" | "online";
export type NodeRole = "origin" | "destination";

export interface LockerNode {
  id: string;
  name: string;
  address: string;
  /** e.g. "0.5km away" */
  distance: string;
  /** e.g. "Ground Floor" */
  floor: string;
  /** e.g. "24/7 Access • CCTV & Security Guarded" */
  access: string;
  status: "available" | "offline";
  /** e.g. "All sizes" */
  sizes: string;
}

export interface QuoteInput {
  size: PackageSize;
  fragile: boolean;
  speed: DeliverySpeed;
}

export interface CostLine {
  id: string;
  label: string;
  amount: number;
}

export interface SendQuote {
  lines: CostLine[];
  total: number;
  /** e.g. "Tomorrow, 8:00 AM" */
  arrival: string;
  walletBalance: number;
}

export interface RecipientDetails {
  name: string;
  phone: string;
  email: string;
  note: string;
  saveToContacts: boolean;
}

export interface BookingRequest {
  service: SendServiceType;
  size: PackageSize;
  contents: string;
  fragile: boolean;
  originNodeId: string;
  destinationNodeId: string;
  favorite: boolean;
  speed: DeliverySpeed;
  recipient: RecipientDetails;
  channel: PaymentChannel;
}

export interface SendBooking {
  trackingNumber: string;
  dropOffCode: string;
  /** e.g. "Lekki Mall Locker Node, Ground Floor, Near Entrance 2" */
  dropOffLocation: string;
  validUntil: string;
  /** e.g. "7 hours 59 mins remaining" */
  remaining: string;
}

export interface SendService {
  getNodes(): Promise<LockerNode[]>;
  getQuote(input: QuoteInput): Promise<SendQuote>;
  createBooking(request: BookingRequest): Promise<SendBooking>;
}
