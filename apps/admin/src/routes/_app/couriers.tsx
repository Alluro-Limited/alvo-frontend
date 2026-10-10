import {createFileRoute} from "@tanstack/react-router";
import {CouriersPage} from "@/pages/couriers";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/couriers")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.courier"]()})}]}),
  component: couriersPage,
});

function couriersPage() {
  return <CouriersPage />;
}
