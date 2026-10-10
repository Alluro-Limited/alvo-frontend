import type {PayoutsService} from "@/types/payouts-types";
import {httpPayoutsService} from "./http-payouts-service";
import {mockPayoutsService} from "./mocks/mock-payout-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves payouts. */
export const payoutsService: PayoutsService = import.meta.env.VITE_API_URL ? httpPayoutsService : mockPayoutsService;
