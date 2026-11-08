import type {UserAuthService} from "@/types/auth-types";
import {httpAuthService} from "./http-auth-service";

/** Authentication against the real API. */
export const authService: UserAuthService = httpAuthService;
