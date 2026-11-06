import {formatDateTimeBar} from "@/lib/datetime";
import {mapError} from "@/lib/api-errors";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {ApiGetJobResponse, ApiScanParcelRequest} from "@/types/api-types";
import type {DeliveryDetail, DeliveryService, DeliveryStatus, ManifestPackage} from "@/types/delivery-types";

const SCANNED_STATES = new Set(["PARCEL_STATE_IN_TRANSIT", "PARCEL_STATE_AT_DEST", "PARCEL_STATE_COLLECTED"]);

const toPackage = (p: ApiGetJobResponse["parcels"][number]): ManifestPackage => ({
  code: p.trackingNo,
  name: p.destNodeName,
  weight: "",
  scanned: SCANNED_STATES.has(p.state),
});

const toDetail = (res: ApiGetJobResponse): DeliveryDetail => ({
  id: res.job.id,
  kind: "regular",
  dateLabel: formatDateTimeBar(res.job.offeredAt),
  accessCode: "",
  stops: res.parcels.map((p) => ({label: p.destNodeName, address: "", kind: "dropoff" as const})),
  distanceKm: 0,
  manifestTotal: res.parcels.length,
  packages: res.parcels.map(toPackage),
  status: "assigned",
  timeline: [],
  payout: koboToNaira(res.job.earningsKobo),
});

const getJob = (jobId: string) => apiClient.get(`v1/courier/jobs/${jobId}`).json<ApiGetJobResponse>();

/**
 * A delivery against `v1/courier/jobs/{id}` and `v1/courier/scan`. The wire exposes no
 * access code, stop addresses, or timeline — and no job-level status writes: parcels move
 * by scanning them (`scan_type` pickup/dropoff), so `updateStatus` just refetches.
 */
export const httpDeliveryService: DeliveryService = {
  getDelivery: async (jobId) => toDetail(await getJob(jobId)),
  scanNextPackage: async (jobId) => {
    const job = await getJob(jobId);
    const next = job.parcels.find((p) => !SCANNED_STATES.has(p.state));
    if (next) {
      const body: ApiScanParcelRequest = {trackingNo: next.trackingNo, scanType: "SCAN_TYPE_PICKUP"};
      await apiClient.post("v1/courier/scan", {json: body});
    }
    return toDetail(await getJob(jobId));
  },
  scanPackage: async (jobId, code) => {
    const body: ApiScanParcelRequest = {trackingNo: code, scanType: "SCAN_TYPE_PICKUP"};
    await apiClient.post("v1/courier/scan", {json: body}).catch(mapError({404: "not_found", 409: "already_scanned"}));
    return toDetail(await getJob(jobId));
  },
  updateStatus: async (jobId, _status: DeliveryStatus) => toDetail(await getJob(jobId)),
};
