import {createFileRoute} from "@tanstack/react-router";
import {PlaceholderPage} from "@/pages/placeholder-page";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/users")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.users"]()})}]}),
  component: usersPage,
});

function usersPage() {
  return <PlaceholderPage title={m["nav.users"]()} />;
}
