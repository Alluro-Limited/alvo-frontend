import type {AuthService} from "@/types/auth-types";
import {httpAuthService} from "./http-auth-service";
import {mockAuthService} from "./mocks/mock-auth-service";

/**
 * There is no backend yet: without `VITE_API_URL`, auth is served by the local mock
 * (see `MOCK_AUTH` for the inputs that reach each state). Setting the URL switches to HTTP.
 */
export const authService: AuthService = import.meta.env.VITE_API_URL ? httpAuthService : mockAuthService;
