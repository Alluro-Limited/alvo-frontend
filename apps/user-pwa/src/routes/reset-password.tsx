import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {ResetPasswordPage} from "@/pages/reset-password";

export const Route = createFileRoute("/reset-password")({
  head: () => ({meta: [{title: m["rp.meta_title"]()}]}),
  component: ResetPasswordPage,
});
