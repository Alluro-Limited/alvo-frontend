import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {DeliveriesPage} from "@/pages/deliveries";

export const Route = createFileRoute("/_tabs/deliveries")({
  head: () => ({meta: [{title: m["deliveries.meta_title"]()}]}),
  component: DeliveriesPage,
});
