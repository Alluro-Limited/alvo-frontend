import {apiClient} from "@/services/api-client";
import type {SmesService} from "@/types/smes-types";

const U = "not supported by the API yet";

/**
 * Hybrid: suspend/reactivate/flag ride `v1/admin/smes/**` and `v1/admin/flags`;
 * list/detail/update/verification/deactivate/export have no endpoints.
 */
export const httpSmesService: SmesService = {
  getSmes: async () => {
    throw new Error(`SME list is ${U}`);
  },
  getSmeDetail: async () => {
    throw new Error(`SME detail is ${U}`);
  },
  updateSme: async () => {
    throw new Error(`SME update is ${U}`);
  },
  approveVerificationItem: async () => {
    throw new Error(`verification approval is ${U}`);
  },
  suspendSme: async (id) => {
    await apiClient.post(`v1/admin/smes/${id}/suspend`, {json: {}});
    return {id, status: "suspended"};
  },
  unsuspendSme: async (id) => {
    await apiClient.post(`v1/admin/smes/${id}/reactivate`, {json: {}});
    return {id, status: "active"};
  },
  flagSmes: async (input) => {
    await Promise.all(
      input.ids.map((id) =>
        apiClient.post("v1/admin/flags", {
          json: {targetType: "FLAG_TARGET_TYPE_SME", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
        })
      )
    );
    return {ids: input.ids, status: "flagged"};
  },
  deactivateSme: async () => {
    throw new Error(`SME deactivate is ${U}`);
  },
  exportSmes: async () => {
    throw new Error(`SME export is ${U}`);
  },
};
