import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.overview"]()})}]}),
  component: dashboardPage,
});

function dashboardPage() {
  return <PlaceholderPage title={m["nav.overview"]()} />;
}
