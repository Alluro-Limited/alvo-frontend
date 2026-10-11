import {createFileRoute} from "@tanstack/react-router";
import {WalletPage} from "@/pages/wallet";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/wallet")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.wallet"]()})}]}),
  component: WalletPage,
});
