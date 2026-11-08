import type {CourierHomeService} from "@/types/home-types";
import {httpHomeService} from "./http-home-service";

/** Home against the real API. */
export const homeService: CourierHomeService = httpHomeService;
