import type {ProfileService} from "@/types/profile-types";
import {httpProfileService} from "./http-profile-service";
import {mockProfileService} from "./mocks/mock-profile-service";

/** Signed-in admin profile service — real HTTP API when `VITE_API_URL` is set, deterministic mock otherwise. */
export const profileService: ProfileService = import.meta.env.VITE_API_URL ? httpProfileService : mockProfileService;
