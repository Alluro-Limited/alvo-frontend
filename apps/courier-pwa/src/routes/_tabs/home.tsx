import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {HomePage} from "@/pages/home";

export const Route = createFileRoute("/_tabs/home")({
  head: () => ({meta: [{title: m["home.meta_title"]()}]}),
  component: HomePage,
});
