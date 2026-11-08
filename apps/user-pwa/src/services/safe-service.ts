import type {SafeService} from "@/types/safe-types";
import {httpSafeService} from "./http-safe-service";

/** Safe Storage against the real API. */
export const safeService: SafeService = httpSafeService;
