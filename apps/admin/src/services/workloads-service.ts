import type {WorkloadsService} from "@/types/workloads-types";
import {httpWorkloadsService} from "./http-workloads-service";

/** Workloads Service service against the real API. */
export const workloadsService: WorkloadsService = httpWorkloadsService;
