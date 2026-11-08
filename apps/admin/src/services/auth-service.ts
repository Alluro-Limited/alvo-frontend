import type {AuthService} from "@/types/auth-types";
import {httpAuthService} from "./http-auth-service";

/** Authentication against the real API. */
export const authService: AuthService = httpAuthService;
