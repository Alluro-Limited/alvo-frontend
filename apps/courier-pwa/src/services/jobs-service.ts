import type {JobsService} from "@/types/delivery-types";
import {httpJobsService} from "./http-jobs-service";
import {mockJobsService} from "./mocks/mock-jobs-service";

/** No backend yet: without `VITE_API_URL`, the marketplace list is served by the local mock. */
export const jobsService: JobsService = import.meta.env.VITE_API_URL ? httpJobsService : mockJobsService;
