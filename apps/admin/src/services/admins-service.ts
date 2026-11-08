import type {AdminsService} from "@/types/admins-types";
import {httpAdminsService} from "./http-admins-service";

/** Admins Service service against the real API. */
export const adminsService: AdminsService = httpAdminsService;
