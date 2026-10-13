import {httpHomeService} from "./http-home-service";
import {mockHomeService} from "./mocks/mock-home-service";
import type {HomeService} from "@/types/home-types";

/** No backend yet: without `VITE_API_URL`, home data comes from the local mock. */
export const homeService: HomeService = import.meta.env.VITE_API_URL ? httpHomeService : mockHomeService;
