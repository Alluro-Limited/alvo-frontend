import {httpAccountService} from "./http-account-service";
import {mockAccountService} from "./mocks/mock-account-service";
import type {AccountService} from "@/types/earnings-types";

/** No backend yet: without `VITE_API_URL`, profile and support data come from the local mock. */
export const accountService: AccountService = import.meta.env.VITE_API_URL ? httpAccountService : mockAccountService;
