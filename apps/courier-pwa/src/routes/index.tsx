import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {SplashPage} from "@/pages/splash";

export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: m["splash.meta_title"]()}]}),
  component: SplashPage,
});
