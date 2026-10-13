import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {BankAccountPage} from "@/pages/bank-account";

export const Route = createFileRoute("/bank-account")({
  head: () => ({meta: [{title: m["bank.meta_title"]()}]}),
  component: BankAccountPage,
});
