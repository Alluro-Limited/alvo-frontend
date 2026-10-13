import {httpActivityService} from "./http-activity-service";
import {mockActivityService} from "./mocks/mock-activity-service";
import type {ActivityService} from "@/types/activity-types";

/** No backend yet: without `VITE_API_URL`, Activities data comes from the local mock. */
export const activityService: ActivityService = import.meta.env.VITE_API_URL ? httpActivityService : mockActivityService;
