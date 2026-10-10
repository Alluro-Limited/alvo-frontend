import {createFileRoute} from "@tanstack/react-router";
import {AssignmentPage} from "@/pages/assignment";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/assignment")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.assignment"]()})}]}),
  component: AssignmentPage,
});
