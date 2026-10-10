import type {RevenueService} from "@/types/revenue-types";
import {httpRevenueService} from "./http-revenue-service";
import {mockRevenueService} from "./mocks/mock-revenue-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves revenue. */
export const revenueService: RevenueService = import.meta.env.VITE_API_URL ? httpRevenueService : mockRevenueService;
