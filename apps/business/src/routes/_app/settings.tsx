import {createFileRoute} from "@tanstack/react-router";
import {SettingsPage} from "@/pages/settings";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.settings"]()})}]}),
  component: SettingsPage,
});
