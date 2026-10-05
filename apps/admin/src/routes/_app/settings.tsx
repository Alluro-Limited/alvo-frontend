import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.settings"]()})}]}),
  component: settingsPage,
});

function settingsPage() {
  return <PlaceholderPage title={m["nav.settings"]()} />;
}
