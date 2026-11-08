import type {PayoutsService} from "@/types/payouts-types";
import {httpPayoutsService} from "./http-payouts-service";

/** Courier payouts against the real admin API. */
export const payoutsService: PayoutsService = httpPayoutsService;
