import type {WorkloadsService} from "@/types/workloads-types";
import {httpWorkloadsService} from "./http-workloads-service";
import {mockWorkloadsService} from "./mocks/mock-workloads-service";

/** Same mock/HTTP split as auth and dashboard: no `VITE_API_URL` means the local mock serves workloads. */
export const workloadsService: WorkloadsService = import.meta.env.VITE_API_URL ? httpWorkloadsService : mockWorkloadsService;
