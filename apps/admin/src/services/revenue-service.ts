import type {RevenueService} from "@/types/revenue-types";
import {mockRevenueService} from "./mocks/mock-revenue-service";

/** No revenue endpoints in the API yet — always the local mock for now, even when `VITE_API_URL` is set. */
export const revenueService: RevenueService = mockRevenueService;
