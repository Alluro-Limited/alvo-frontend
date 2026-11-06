import type {PayoutsService} from "@/types/payouts-types";
import {mockPayoutsService} from "./mocks/mock-payout-service";

/** No payout endpoints in the API yet — always the local mock for now, even when `VITE_API_URL` is set. */
export const payoutsService: PayoutsService = mockPayoutsService;
