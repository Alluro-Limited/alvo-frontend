import {httpSafeService} from "./http-safe-service";
import {mockSafeService} from "./mocks/mock-safe-service";
import type {SafeService} from "@/types/safe-types";

/** No backend yet: without `VITE_API_URL`, Safe Storage data comes from the local mock. */
export const safeService: SafeService = import.meta.env.VITE_API_URL ? httpSafeService : mockSafeService;
