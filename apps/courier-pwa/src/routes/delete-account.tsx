import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {DeleteAccountPage} from "@/pages/delete-account";

export const Route = createFileRoute("/delete-account")({
  head: () => ({meta: [{title: m["del.meta_title"]()}]}),
  component: DeleteAccountPage,
});
