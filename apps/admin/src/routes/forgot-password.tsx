import {createFileRoute} from "@tanstack/react-router";
import {ForgotPasswordPage} from "@/pages/forgot-password";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({meta: [{title: m["forgot_password.meta_title"]()}]}),
  component: ForgotPasswordPage,
});
