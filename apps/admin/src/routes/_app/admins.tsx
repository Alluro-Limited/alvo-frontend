import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/admins")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.admins_permissions"]()})}]}),
  component: adminsPage,
});

function adminsPage() {
  return <PlaceholderPage title={m["nav.admins_permissions"]()} />;
}
