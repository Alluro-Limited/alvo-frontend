import {mockSafeService} from "./mocks/mock-safe-service";
import type {SafeService} from "@/types/safe-types";

/**
 * Safe Storage has no endpoints in the API yet — always the local mock for now,
 * even when `VITE_API_URL` is set. Swap back to the http service when they land.
 */
export const safeService: SafeService = mockSafeService;
