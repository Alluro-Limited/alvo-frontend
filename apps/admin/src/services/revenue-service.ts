import type {RevenueService} from "@/types/revenue-types";
import {httpRevenueService} from "./http-revenue-service";

/** Revenue analytics against the real admin API. */
export const revenueService: RevenueService = httpRevenueService;
