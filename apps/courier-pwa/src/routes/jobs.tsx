import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {JobsPage} from "@/pages/jobs";

export const Route = createFileRoute("/jobs")({
  head: () => ({meta: [{title: m["jobs.meta_title"]()}]}),
  component: JobsPage,
});
