import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/nodes")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.nodes"]()})}]}),
  component: nodesPage,
});

function nodesPage() {
  return <PlaceholderPage title={m["nav.nodes"]()} />;
}
