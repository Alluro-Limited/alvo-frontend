import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {AnalyticsPage} from "@/pages/analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({meta: [{title: m["analytics.title"]()}]}),
  component: AnalyticsPage,
});
