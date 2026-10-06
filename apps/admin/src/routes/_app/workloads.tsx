import {createFileRoute} from "@tanstack/react-router";
import {WorkloadsPage} from "@/pages/workloads";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/workloads")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.workloads"]()})}]}),
  component: WorkloadsPage,
});
