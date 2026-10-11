import {createFileRoute} from "@tanstack/react-router";
import {HelpPage} from "@/pages/help";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/help")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.help_support"]()})}]}),
  component: HelpPage,
});
