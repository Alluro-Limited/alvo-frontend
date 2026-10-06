import {createFileRoute} from "@tanstack/react-router";
import {OverviewPage} from "@/pages/overview";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.overview"]()})}]}),
  component: OverviewPage,
});
