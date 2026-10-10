import type {AdminsService} from "@/types/admins-types";
import {httpAdminsService} from "./http-admins-service";
import {mockAdminsService} from "./mocks/mock-admins-service";

/** Admin management service — real HTTP API when `VITE_API_URL` is set, deterministic mock otherwise. */
export const adminsService: AdminsService = import.meta.env.VITE_API_URL ? httpAdminsService : mockAdminsService;
