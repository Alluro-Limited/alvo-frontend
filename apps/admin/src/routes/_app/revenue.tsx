import {createFileRoute} from "@tanstack/react-router";
import {RevenuePage} from "@/pages/revenue";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/revenue")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.revenue"]()})}]}),
  component: revenuePage,
});

function revenuePage() {
  return <RevenuePage />;
}
