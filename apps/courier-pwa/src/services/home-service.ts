import type {CourierHomeService} from "@/types/home-types";
import {httpHomeService} from "./http-home-service";
import {mockHomeService} from "./mocks/mock-home-service";

/**
 * There is no backend yet: without `VITE_API_URL`, home data is served by the local mock.
 * Setting the URL switches to HTTP.
 */
export const homeService: CourierHomeService = import.meta.env.VITE_API_URL ? httpHomeService : mockHomeService;
