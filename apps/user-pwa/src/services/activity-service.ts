import {httpActivityService} from "./http-activity-service";
import type {ActivityService} from "@/types/activity-types";

/** Apps/User Pwa/Src/Services/Activity Service service against the real API. */
export const activityService: ActivityService = httpActivityService;
