import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {SignUpPage} from "@/pages/sign-up";

export const Route = createFileRoute("/sign-up")({
  head: () => ({meta: [{title: m["signup.meta_title"]()}]}),
  component: SignUpPage,
});
