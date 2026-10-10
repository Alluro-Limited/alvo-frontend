import {createFileRoute} from "@tanstack/react-router";
import * as v from "valibot";
import {WorkloadsPage} from "@/pages/workloads";
import {m} from "@/paraglide/messages";

const SearchSchema = v.object({tab: v.fallback(v.picklist(["single", "batches", "safe"]), "single")});

export const Route = createFileRoute("/_app/workloads/")({
  validateSearch: (search) => v.parse(v.fallback(SearchSchema, {tab: "single"}), search),
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.workloads"]()})}]}),
  component: WorkloadsPage,
});
