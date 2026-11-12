import {apiClient} from "@/services/api-client";
import {getStepUpToken} from "@/services/step-up";
import type {CouriersService} from "@/types/couriers-types";

const U = "not supported by the API yet";

/**
 * Hybrid: suspend/reactivate/delete/flag ride `v1/admin/couriers/**` and
 * `v1/admin/flags`; list/detail/tracking/verification/export have no endpoints.
 */
export const httpCouriersService: CouriersService = {
  getCouriers: async () => {
    throw new Error(`courier list is ${U}`);
  },
  getCourierTracking: async () => {
    throw new Error(`courier tracking is ${U}`);
  },
  getCourierDetail: async () => {
    throw new Error(`courier detail is ${U}`);
  },
  getCourierAssignments: async () => {
    throw new Error(`courier assignments is ${U}`);
  },
  approveVerificationItem: async () => {
    throw new Error(`verification approval is ${U}`);
  },
  suspendCourier: async (id) => {
    await apiClient.post(`v1/admin/couriers/${id}/suspend`, {json: {}});
    return {id, status: "suspended"};
  },
  unsuspendCourier: async (id) => {
    await apiClient.post(`v1/admin/couriers/${id}/reactivate`, {json: {}});
    return {id, status: "active"};
  },
  flagCouriers: async (input) => {
    await Promise.all(
      input.ids.map((id) =>
        apiClient.post("v1/admin/flags", {
          json: {targetType: "FLAG_TARGET_TYPE_COURIER", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
        })
      )
    );
    return {ids: input.ids, status: "flagged"};
  },
  deleteCourier: async (id) => {
    await apiClient.post(`v1/admin/couriers/${id}/delete`, {json: {}, headers: {"X-Step-Up": await getStepUpToken()}});
    return {id};
  },
  exportCouriers: async () => {
    throw new Error(`courier export is ${U}`);
  },
  exportCourierAssignments: async () => {
    throw new Error(`courier assignments export is ${U}`);
  },
};
