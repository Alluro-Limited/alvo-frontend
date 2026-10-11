import {createFileRoute} from "@tanstack/react-router";
import {BatchesPage} from "@/pages/batches";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/shipments")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["batches.title"]()})}]}),
  component: BatchesPage,
});
