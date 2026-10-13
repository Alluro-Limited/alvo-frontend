import type {JobKind} from "./home-types";

/** A job posted on the marketplace — outside the courier's assigned zone. */
export interface JobOffer {
  id: string;
  kind: JobKind;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  payout: number;
  packages: number;
  distanceKm: number;
  pickupBy: string;
  deliverBy: string;
}

export type DeliveryStatus = "assigned" | "in_transit" | "delayed" | "dropped_off";

export interface RouteStop {
  label: string;
  address: string;
  kind: "pickup" | "dropoff";
}

export interface ManifestPackage {
  code: string;
  name: string;
  /** Display string from the design, e.g. "2.0Kg" / "500g". */
  weight: string;
  scanned: boolean;
}

export interface TimelineEntry {
  label: string;
  at: string;
}

/** The active delivery behind View Details / an accepted job offer. */
export interface DeliveryDetail {
  id: string;
  kind: JobKind;
  /** e.g. "24 June, 2024 | 08:45 AM". */
  dateLabel: string;
  accessCode: string;
  stops: RouteStop[];
  distanceKm: number;
  /** Total packages in the manifest — the denominator in "Packages (4/9)". */
  manifestTotal: number;
  packages: ManifestPackage[];
  status: DeliveryStatus;
  timeline: TimelineEntry[];
  payout: number;
}

export interface JobsService {
  getJobs: () => Promise<JobOffer[]>;
  acceptJob: (jobId: string) => Promise<void>;
  declineJob: (jobId: string) => Promise<void>;
}

export interface DeliveryService {
  getDelivery: (jobId: string) => Promise<DeliveryDetail>;
  /** Camera scan: the backend decides which manifest code the barcode resolved to. */
  scanNextPackage: (jobId: string) => Promise<DeliveryDetail>;
  /** Manual entry of a specific code. 404 = not in manifest, 409 = already scanned. */
  scanPackage: (jobId: string, code: string) => Promise<DeliveryDetail>;
  updateStatus: (jobId: string, status: DeliveryStatus) => Promise<DeliveryDetail>;
}
