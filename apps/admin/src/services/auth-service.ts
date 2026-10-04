import {apiClient} from "@/services/api-client";
import type {SignInCredentials} from "@/types/auth-types";

/** The backend sets the session as an httpOnly cookie, so a successful sign-in has no body to keep. */
export const authService = {
  signIn: async (credentials: SignInCredentials): Promise<void> => {
    await apiClient.post("auth/login", {json: credentials});
  },
};
