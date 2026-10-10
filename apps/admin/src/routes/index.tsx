import {createFileRoute} from "@tanstack/react-router";
import {SignInPage} from "@/pages/sign-in";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: m["sign_in.meta_title"]()}]}),
  component: SignInPage,
});
