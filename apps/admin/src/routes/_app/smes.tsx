import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/smes")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.smes"]()})}]}),
  component: smesPage,
});

function smesPage() {
  return <PlaceholderPage title={m["nav.smes"]()} />;
}
