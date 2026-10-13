import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {OnboardingPage} from "@/pages/onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({meta: [{title: m["onb.meta_title"]()}]}),
  component: OnboardingPage,
});
