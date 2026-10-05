import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/couriers")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.courier"]()})}]}),
  component: couriersPage,
});

function couriersPage() {
  return <PlaceholderPage title={m["nav.courier"]()} />;
}
