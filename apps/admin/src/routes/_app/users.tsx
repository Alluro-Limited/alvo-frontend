import {createFileRoute} from "@tanstack/react-router";
import {UsersPage} from "@/pages/users";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/users")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.users"]()})}]}),
  component: UsersPage,
});
