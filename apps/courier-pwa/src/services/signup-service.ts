import type {SignupService} from "@/types/signup-types";
import {httpSignupService} from "./http-signup-service";
import {mockSignupService} from "./mocks/mock-signup-service";

/**
 * Picks the signup service: the mock while `VITE_API_URL` is unset, HTTP otherwise.
 */
export const signupService: SignupService = import.meta.env.VITE_API_URL ? httpSignupService : mockSignupService;
