import type {CouriersService} from "@/types/couriers-types";
import {httpCouriersService} from "./http-couriers-service";
import {mockCouriersService} from "./mocks/mock-couriers-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves couriers. */
export const couriersService: CouriersService = import.meta.env.VITE_API_URL ? httpCouriersService : mockCouriersService;
