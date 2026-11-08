import type {CouriersService} from "@/types/couriers-types";
import {httpCouriersService} from "./http-couriers-service";

/** Live where the API covers it — list/detail reads throw until list endpoints land. */
export const couriersService: CouriersService = httpCouriersService;
