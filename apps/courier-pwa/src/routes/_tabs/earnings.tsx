import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {EarningsPage} from "@/pages/earnings";

export const Route = createFileRoute("/_tabs/earnings")({
  head: () => ({meta: [{title: m["earnings.meta_title"]()}]}),
  component: EarningsPage,
});
