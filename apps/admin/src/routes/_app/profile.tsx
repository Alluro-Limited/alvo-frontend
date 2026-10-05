import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.my_profile"]()})}]}),
  component: profilePage,
});

function profilePage() {
  return <PlaceholderPage title={m["nav.my_profile"]()} />;
}
