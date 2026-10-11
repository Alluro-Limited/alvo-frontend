import {createFileRoute} from "@tanstack/react-router";
import {SignUpPage} from "@/pages/sign-up";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/sign-up")({
  head: () => ({meta: [{title: m["sign_up.meta_title"]()}]}),
  component: SignUpPage,
});
