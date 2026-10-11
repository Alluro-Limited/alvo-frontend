import {createFileRoute} from "@tanstack/react-router";
import {LoginPage} from "@/pages/login";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: m["login.meta_title"]()}]}),
  component: LoginPage,
});
