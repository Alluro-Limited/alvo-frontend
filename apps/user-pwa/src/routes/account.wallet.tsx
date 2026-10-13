import {createFileRoute} from "@tanstack/react-router";
import {WalletPage} from "@/pages/wallet";

export const Route = createFileRoute("/account/wallet")({
  component: WalletPage,
});
