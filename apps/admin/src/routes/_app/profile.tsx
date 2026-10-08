import {createFileRoute} from "@tanstack/react-router";
import {ProfilePage} from "@/pages/profile";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.my_profile"]()})}]}),
  component: ProfilePage,
});
