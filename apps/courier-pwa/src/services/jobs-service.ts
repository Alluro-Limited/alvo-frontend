import type {JobsService} from "@/types/delivery-types";
import {httpJobsService} from "./http-jobs-service";

/** Apps/Courier Pwa/Src/Services/Jobs Service service against the real API. */
export const jobsService: JobsService = httpJobsService;
