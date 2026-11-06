import {apiClient} from "@/services/api-client";
import type {ApiOnboardCourierRequest} from "@/types/api-types";
import type {SignupService} from "@/types/signup-types";

const VEHICLE: Record<string, string> = {
  bicycle: "VEHICLE_TYPE_BICYCLE",
  motorcycle: "VEHICLE_TYPE_BIKE",
  car: "VEHICLE_TYPE_CAR",
  van: "VEHICLE_TYPE_VAN",
};

/**
 * Courier onboarding against `v1/courier/onboard`. The wire takes only vehicle/plate/areas —
 * personal details, NIN, experience, and photos have no fields and are dropped until the
 * API grows them. Requires a signed-in user (onboard rides the user session).
 */
export const httpSignupService: SignupService = {
  submitApplication: async (draft) => {
    const body: ApiOnboardCourierRequest = {
      vehicleType: VEHICLE[draft.vehicle.type],
      plate: draft.vehicle.plate,
      areas: draft.deliveryArea ? [draft.deliveryArea] : [],
    };
    const res = await apiClient.post("v1/courier/onboard", {json: body}).json<{courier?: {id?: string}}>();
    return {applicationId: res.courier?.id ?? ""};
  },
};
