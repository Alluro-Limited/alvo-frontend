import type {WalletService} from "@/types/wallet-types";
import {httpWalletService} from "./http-wallet-service";

/** Wallet against the real API. */
export const walletService: WalletService = httpWalletService;
