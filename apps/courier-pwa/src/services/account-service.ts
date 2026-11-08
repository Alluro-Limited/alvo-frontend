import {httpAccountService} from "./http-account-service";
import type {AccountService} from "@/types/earnings-types";

/** Apps/Courier Pwa/Src/Services/Account Service service against the real API. */
export const accountService: AccountService = httpAccountService;
