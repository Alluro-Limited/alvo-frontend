import {createFileRoute} from "@tanstack/react-router";
import {DashboardPage} from "@/pages/dashboard";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.home"]()})}]}),
  component: DashboardPage,
});
