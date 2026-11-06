import type {CouriersService} from "@/types/couriers-types";
import {httpCouriersService} from "./http-couriers-service";
import {mockCouriersService} from "./mocks/mock-couriers-service";

/** Live where the API covers it — list/detail reads throw until list endpoints land. */
export const couriersService: CouriersService = import.meta.env.VITE_API_URL ? httpCouriersService : mockCouriersService;
