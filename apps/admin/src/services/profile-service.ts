import type {ProfileService} from "@/types/profile-types";
import {httpProfileService} from "./http-profile-service";

/** Profile Service service against the real API. */
export const profileService: ProfileService = httpProfileService;
