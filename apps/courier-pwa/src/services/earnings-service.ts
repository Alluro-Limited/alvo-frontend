import {httpEarningsService} from "./http-earnings-service";
import {mockEarningsService} from "./mocks/mock-earnings-service";
import type {EarningsService} from "@/types/earnings-types";

/** No backend yet: without `VITE_API_URL`, earnings come from the local mock. */
export const earningsService: EarningsService = import.meta.env.VITE_API_URL ? httpEarningsService : mockEarningsService;
