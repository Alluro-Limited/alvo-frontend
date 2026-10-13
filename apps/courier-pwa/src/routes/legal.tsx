import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {LegalPage} from "@/pages/legal";

export const Route = createFileRoute("/legal")({
  head: () => ({meta: [{title: m["legal.meta_title"]()}]}),
  component: LegalPage,
});
