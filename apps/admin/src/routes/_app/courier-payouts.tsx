import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/courier-payouts")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.courier_payouts"]()})}]}),
  component: CourierPayoutsPage,
});

function CourierPayoutsPage() {
  return <PlaceholderPage title={m["nav.courier_payouts"]()} />;
}
