import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {AccountPage} from "@/pages/account";

export const Route = createFileRoute("/_tabs/profile")({
  head: () => ({meta: [{title: m["profile.meta_title"]()}]}),
  component: AccountPage,
});
