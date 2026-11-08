import {httpHomeService} from "./http-home-service";
import type {HomeService} from "@/types/home-types";

/** Apps/User Pwa/Src/Services/Home Service service against the real API. */
export const homeService: HomeService = httpHomeService;
