import type {AccountService} from "@/types/account-types";
import {httpAccountService} from "./http-account-service";
import {mockAccountService} from "./mocks/mock-account-service";

/** No backend yet: the mock serves the Account tab until `VITE_API_URL` is set. */
export const accountService: AccountService = import.meta.env.VITE_API_URL ? httpAccountService : mockAccountService;
