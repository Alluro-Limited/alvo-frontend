import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {SignInPage} from "@/pages/sign-in";

export const Route = createFileRoute("/sign-in")({
  head: () => ({meta: [{title: m["signin.meta_title"]()}]}),
  component: SignInPage,
});
