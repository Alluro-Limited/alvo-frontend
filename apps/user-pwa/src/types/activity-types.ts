/** A user's activity — a package delivery or a safe-storage reservation shown in the Activities feed. */
export type ActivityKind = "package" | "safe";

export type ActivityFilter = "all" | "active" | "completed" | "cancelled";

export type DeliveryStatus = "pending" | "booked" | "dropped" | "enroute" | "delayed" | "complete" | "expired" | "collected" | "cancelled";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** e.g. "PKG1234" / "SF1234" — rendered under the per-kind "Package ID:"/"Safe ID:" label. */
  refId: string;
  status: DeliveryStatus;
  /** e.g. "Quadri Olatunji" — rendered under the "Recipient:" label. */
  recipient: string;
  /** Naira amount shown right-aligned on the recipient row. */
  amount: number;
  /** e.g. "20th Dec, 2025 • 3:45PM" — rendered under the "ETA:" label. */
  eta: string;
  /** Day-group key for the section divider, e.g. "today" / "yesterday". */
  day: string;
}

export interface DeliveryInfo {
  size: string;
  contents: string;
  value: number;
  recipient: string;
  phone: string;
  note: string;
  speed: string;
}

export interface TimelineEvent {
  label: string;
  time: string;
  /** Optional second line — a location or live note like "Now • 15 mins away". */
  sub: string | null;
  done: boolean;
}

export interface DeliveryTrack {
  /** e.g. "17:50" with the PICKUP caption. */
  pickupTime: string;
  /** e.g. "19:05" with the ETA caption. */
  eta: string;
  /** e.g. "1HR 15MIN". */
  duration: string;
  /** e.g. "3.5km". */
  distance: string;
  /** Filled portion of the tracking bar, 0–1. */
  progress: number;
}

export interface AccessCode {
  /** e.g. "B-1247" — spelled out with spaces on screen. */
  code: string;
  /** e.g. "Dec 22, 11:34 AM" */
  validUntil: string;
  /** e.g. "7 hours 59 mins remaining" */
  remaining: string;
  /** Expired codes render the blurred QR + masked dots. */
  expired: boolean;
  /** Safe pickup codes stay masked behind OTP verification until the owner retrieves them. */
  protected?: boolean;
}

export interface ExtendPreview {
  /** e.g. "+3 Hours". */
  addedTime: string;
  /** e.g. "Today, 2:34 PM". */
  newDeadline: string;
  /** ₦ fee — 0 for free drop-off extensions, a paid fee for pickup reactivation. */
  fee: number;
}

/** Where the recipient collects the package — shown under the pickup code. */
export interface PickupLocation {
  /** e.g. "Ikeja City Center". */
  node: string;
  /** e.g. "#SC-12". */
  locker: string;
  /** e.g. "Ground Floor, near the main entrance escalators." */
  directions: string;
}

export interface ExtendResult {
  /** e.g. "Today, 5:45 PM". */
  newDeadline: string;
  /** e.g. "Ikeja City Center". */
  lockerNode: string;
  /** e.g. "Access Code Reactivated". */
  status: string;
}

/** The safe-storage lifecycle stage shown on the Safe Details page. */
export type SafeStage = "reserved" | "awaiting" | "stored" | "picked" | "expired";

/** The Safe Details status/locker block — countdown, booked→pickup times, and the navigate-to-locker row. */
export interface SafeBlock {
  stage: SafeStage;
  /** Countdown text, e.g. "1HR 15MIN". */
  expiresIn: string;
  /** e.g. "17:50PM" / "19:05PM". */
  bookedAt: string;
  pickupAt: string;
  /** e.g. "Lekki Locker". */
  lockerName: string;
  /** e.g. "LK-43". */
  lockerNo: string;
  /** e.g. "Lekki Phase 1 Smart Locker, 23 Admiralty Way, Lagos State". */
  address: string;
  /** e.g. "2 mins away". */
  distance: string;
}

/** The "Storage Details" sheet content for a safe reservation. */
export interface StorageInfo {
  /** e.g. "#P-IKJ01". */
  node: string;
  /** e.g. "Lekki Phase 1 Smart Locker". */
  location: string;
  /** e.g. "23 Admiralty Way, Lagos State". */
  address: string;
  /** e.g. "Medium (30x20x15cm)". */
  lockerSize: string;
  /** e.g. "4 hours (until 6:00 PM)". */
  duration: string;
  /** e.g. "Bag". */
  item: string;
}

/** A required locker-size upgrade — the package is larger than the booked locker. */
export interface LockerUpgrade {
  /** e.g. "Small". */
  currentSize: string;
  /** e.g. "Medium". */
  newSize: string;
  /** ₦ difference to pay for the larger locker. */
  fee: number;
}

export interface DeliveryDetail {
  id: string;
  kind: ActivityKind;
  refId: string;
  origin: string;
  destination: string;
  status: DeliveryStatus;
  /** e.g. "On the way to destination locker". */
  statusMessage: string;
  updatedAt: string;
  /** Filled milestone segments, 0–4 (fractions allowed — the active segment gets a knob). */
  progress: number;
  amountPaid: number;
  paymentMethod: string;
  paidAt: string;
  /** The sender's drop-off code and the recipient's pickup code (Access view tabs). */
  dropoffAccess: AccessCode;
  /** null while the package hasn't arrived at the destination locker yet. */
  pickupAccess: AccessCode | null;
  /** Where the recipient collects — node, locker number, and wayfinding directions. */
  pickupLocation: PickupLocation;
  /** ₦ fee for reactivating an expired pickup code. */
  pickupExtensionFee: number;
  /** How many drop-off window extensions are still allowed. */
  extensionsRemaining: number;
  /** Present while the shipment is pending a paid locker-size upgrade. */
  lockerUpgrade: LockerUpgrade | null;
  /** Safe-storage status/locker block — non-null when `kind === "safe"`. */
  safe: SafeBlock | null;
  /** "Storage Details" sheet payload — non-null when `kind === "safe"`. */
  storage: StorageInfo | null;
  track: DeliveryTrack;
  info: DeliveryInfo;
  timeline: TimelineEvent[];
}

export interface ActivityService {
  getActivities(): Promise<ActivityItem[]>;
  getDelivery(id: string): Promise<DeliveryDetail>;
  previewDropoffExtension(id: string, hours: number): Promise<ExtendPreview>;
  extendDropoff(id: string, hours: number): Promise<ExtendResult>;
  previewPickupExtension(id: string, hours: number): Promise<ExtendPreview>;
  reactivatePickup(id: string, hours: number, channel: "wallet" | "online"): Promise<ExtendResult>;
  /** Pay the size difference and move the shipment onto the larger locker. */
  upgradeLocker(id: string, channel: "wallet" | "online"): Promise<void>;
  /** Stop the shipment and refund the payment to the wallet. */
  cancelShipment(id: string): Promise<void>;
  /** Sends the 6-digit pickup verification code to the owner's email (safe storage). */
  sendPickupVerification(id: string): Promise<void>;
  /** Verifies the OTP and reveals the one-time safe pickup code. Throws `invalid_code` on a wrong code. */
  verifyPickup(id: string, code: string): Promise<void>;
}
