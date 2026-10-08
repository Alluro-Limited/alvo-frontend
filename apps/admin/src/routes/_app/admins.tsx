import {createFileRoute} from "@tanstack/react-router";
import {AdminsPage} from "@/pages/admins";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/admins")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.admins_permissions"]()})}]}),
  component: AdminsPage,
});
