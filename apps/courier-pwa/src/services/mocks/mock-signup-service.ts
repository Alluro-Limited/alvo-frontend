import {mockDelay} from "@/services/mocks/mock-http";
import type {ApplicationReceipt, CourierApplicationDraft, SignupService} from "@/types/signup-types";

export const mockSignupService: SignupService = {
  submitApplication: async (draft: CourierApplicationDraft): Promise<ApplicationReceipt> => {
    await mockDelay(1200);
    void draft;
    return {applicationId: "AG-2024-0187"};
  },
};
