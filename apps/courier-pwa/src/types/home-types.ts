export type JobKind = "regular" | "speed";

/** assignment = offered (Decline/Accept) → pending = accepted, not started → enroute → complete. */
export type JobStage = "assignment" | "pending" | "enroute" | "complete";

export interface CourierJob {
  /** Public reference, e.g. "PRI-4728123780". */
  id: string;
  kind: JobKind;
  stage: JobStage;
  origin: string;
  destination: string;
  payout: number;
  packages: number;
  pickupTime: string;
  eta: string;
  duration: string;
  distanceKm: number;
}

export interface CourierHome {
  firstName: string;
  area: string;
  /** Whether the courier is receiving assignments right now. */
  isLive: boolean;
  unreadNotifications: boolean;
  jobs: CourierJob[];
}

/** A locker node / neighborhood the courier can operate from. */
export interface DeliveryArea {
  id: string;
  name: string;
  address: string;
}

/** Everything the home tab needs; implemented over HTTP and by the local mock. */
export interface CourierHomeService {
  getHome: () => Promise<CourierHome>;
  setAvailability: (live: boolean) => Promise<void>;
  acceptJob: (jobId: string) => Promise<void>;
  declineJob: (jobId: string) => Promise<void>;
  getAreas: () => Promise<DeliveryArea[]>;
  setDeliveryArea: (areaId: string) => Promise<void>;
}
