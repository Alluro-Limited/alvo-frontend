import type {AccountService} from "@/types/account-types";
import {httpAccountService} from "./http-account-service";

/** Apps/User Pwa/Src/Services/Account Service service against the real API. */
export const accountService: AccountService = httpAccountService;
