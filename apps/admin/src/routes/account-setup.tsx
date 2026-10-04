import {createFileRoute} from "@tanstack/react-router";
import {AccountSetupPage} from "@/pages/account-setup";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/account-setup")({
  head: () => ({meta: [{title: m["account_setup.meta_title"]()}]}),
  component: AccountSetupPage,
});
