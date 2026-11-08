import type {SignupService} from "@/types/signup-types";
import {httpSignupService} from "./http-signup-service";

/** Courier signup against the real API. */
export const signupService: SignupService = httpSignupService;
