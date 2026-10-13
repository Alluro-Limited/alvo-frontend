import {apiClient} from "@/services/api-client";
import type {ApplicationReceipt, SignupService} from "@/types/signup-types";

/** Courier applications over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpSignupService: SignupService = {
  submitApplication: async (draft) => apiClient.post("courier/applications", {json: draft}).json<ApplicationReceipt>(),
};
