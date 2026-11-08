import {httpEarningsService} from "./http-earnings-service";
import type {EarningsService} from "@/types/earnings-types";

/** Apps/Courier Pwa/Src/Services/Earnings Service service against the real API. */
export const earningsService: EarningsService = httpEarningsService;
