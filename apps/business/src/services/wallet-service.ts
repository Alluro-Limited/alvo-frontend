import type {WalletService} from "@/types/wallet-types";
import {httpWalletService} from "./http-wallet-service";
import {mockWalletService} from "./mocks/mock-wallet-service";

/**
 * Picks the wallet service: the mock while `VITE_API_URL` is unset, HTTP otherwise.
 * The demo account sees a funded wallet; anyone else starts empty until they
 * generate a transfer account or top up.
 */
export const walletService: WalletService = import.meta.env.VITE_API_URL ? httpWalletService : mockWalletService;
