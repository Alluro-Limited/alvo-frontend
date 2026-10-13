import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {SplashPage} from "@/pages/index";

export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: m["index.meta_title"]()}]}),
  component: SplashPage,
});
