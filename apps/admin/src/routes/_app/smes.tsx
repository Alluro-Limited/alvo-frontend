import {createFileRoute} from "@tanstack/react-router";
import {SmesPage} from "@/pages/smes";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/smes")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.smes"]()})}]}),
  component: SmesPage,
});
