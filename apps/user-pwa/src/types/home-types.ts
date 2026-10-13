/** A locker pin on the home map; `x`/`y` are percentages of the map image. */
export interface LockerPin {
  id: string;
  /** Badge label, e.g. "P12". */
  label: string;
  x: number;
  y: number;
  /** Pin badge color (hex). */
  color: string;
}

/** Detail shown in the locker modal when a pin is tapped. */
export interface LockerDetail {
  id: string;
  /** e.g. "Locker P12 – Ikeja". */
  name: string;
  available: boolean;
  slots: number;
}

/** A search result row in the Change Location sheet. */
export interface AreaResult {
  id: string;
  /** Bold address line, e.g. "129 Igbogbo Road, Ikorodu, Lagos". */
  address: string;
  /** Grey sub-line, e.g. "Ikorodu, Lagos State". */
  area: string;
}

export interface HomeService {
  /** The area label shown in the home header ("Oshodi"). */
  getArea: () => Promise<string>;
  setArea: (area: string) => Promise<void>;
  /** Pins overlaid on the static map. */
  getLockers: () => Promise<LockerPin[]>;
  getLocker: (id: string) => Promise<LockerDetail>;
  /** Change Location sheet search; empty array when nothing matches. */
  searchAreas: (query: string) => Promise<AreaResult[]>;
}
