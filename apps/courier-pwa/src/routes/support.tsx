import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {SupportPage} from "@/pages/support";

export const Route = createFileRoute("/support")({
  head: () => ({meta: [{title: m["support.meta_title"]()}]}),
  component: SupportPage,
});
