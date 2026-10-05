import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/workloads")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.workloads"]()})}]}),
  component: workloadsPage,
});

function workloadsPage() {
  return <PlaceholderPage title={m["nav.workloads"]()} />;
}
