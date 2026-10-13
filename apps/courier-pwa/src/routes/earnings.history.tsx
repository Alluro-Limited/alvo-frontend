import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {EarningsHistoryPage} from "@/pages/earnings-history";

export const Route = createFileRoute("/earnings/history")({
  head: () => ({meta: [{title: m["earnings.history_meta_title"]()}]}),
  component: EarningsHistoryPage,
});
