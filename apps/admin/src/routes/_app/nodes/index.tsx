import {createFileRoute} from "@tanstack/react-router";
import {NodesPage} from "@/pages/nodes";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/nodes/")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.nodes"]()})}]}),
  component: NodesPage,
});
