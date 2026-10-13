import {API_ERROR_CODES} from "@/lib/api-errors";
import type {DeliveryDetail, DeliveryService, DeliveryStatus, ManifestPackage} from "@/types/delivery-types";
import {mockDelay, mockHttpError} from "./mock-http";

const MANIFEST: Omit<ManifestPackage, "scanned">[] = [
  {code: "PKG-001-2024", name: "Document Envelope", weight: "1.5Kg"},
  {code: "PKG-002-2024", name: "Business Report", weight: "2.0Kg"},
  {code: "PKG-003-2024", name: "Financial Statement", weight: "1.2Kg"},
  {code: "PKG-004-2024", name: "Package - Fragile", weight: "2.0Kg"},
  {code: "PKG-005-2024", name: "Shoe", weight: "500g"},
  {code: "PKG-006-2024", name: "Package", weight: "850g"},
  {code: "PKG-007-2024", name: "Box", weight: "750g"},
  {code: "PKG-008-2024", name: "Heel - Fragile", weight: "1.5Kg"},
  {code: "PKG-009-2024", name: "Cloth Box", weight: "300g"},
];

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  assigned: "Assigned",
  in_transit: "Intransit",
  delayed: "Delayed",
  dropped_off: "Dropped Off",
};

/** Per-delivery mutable state so scan/status actions survive across refetches. */
const deliveries = new Map<string, DeliveryDetail>();

function seed(jobId: string): DeliveryDetail {
  const existing = deliveries.get(jobId);
  if (existing) return existing;
  const delivery: DeliveryDetail = {
    id: jobId,
    kind: "regular",
    dateLabel: "24 June, 2024 | 08:45 AM",
    accessCode: "847215",
    stops: [
      {label: "Locker #1", address: "B2/128 Alh. Olatunji Srt, Lekki Phase 1", kind: "pickup"},
      {label: "Drop Zone - Locker #IKJ03", address: "First Bank, Lekki Phase 1", kind: "dropoff"},
    ],
    distanceKm: 3.4,
    manifestTotal: MANIFEST.length,
    packages: MANIFEST.map((p) => ({...p, scanned: false})),
    status: "assigned",
    timeline: [{label: "Assigned", at: "20 Dec, 9:45 AM"}],
    payout: 3200,
  };
  deliveries.set(jobId, delivery);
  return delivery;
}

function appendStatus(delivery: DeliveryDetail, status: DeliveryStatus) {
  delivery.status = status;
  delivery.timeline = [...delivery.timeline, {label: STATUS_LABEL[status], at: "20 Dec, 9:45 AM"}];
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockDeliveryService: DeliveryService = {
  getDelivery: async (jobId) => {
    await mockDelay(300);
    return {...seed(jobId), packages: [...seed(jobId).packages]};
  },
  scanNextPackage: async (jobId) => {
    await mockDelay(600);
    const delivery = seed(jobId);
    const next = delivery.packages.find((p) => !p.scanned);
    if (!next) throw mockHttpError(`courier/deliveries/${jobId}/scan`, API_ERROR_CODES.GONE);
    next.scanned = true;
    return {...delivery, packages: [...delivery.packages]};
  },
  scanPackage: async (jobId, code) => {
    await mockDelay(300);
    const delivery = seed(jobId);
    const entry = delivery.packages.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
    if (!entry) throw mockHttpError(`courier/deliveries/${jobId}/scan`, API_ERROR_CODES.NOT_FOUND);
    if (entry.scanned) throw mockHttpError(`courier/deliveries/${jobId}/scan`, API_ERROR_CODES.CONFLICT);
    entry.scanned = true;
    return {...delivery, packages: [...delivery.packages]};
  },
  updateStatus: async (jobId, status) => {
    await mockDelay(400);
    const delivery = seed(jobId);
    appendStatus(delivery, status);
    return {...delivery, packages: [...delivery.packages]};
  },
};
