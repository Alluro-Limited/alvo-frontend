import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {PersonalInfoPage} from "@/pages/personal-info";

export const Route = createFileRoute("/personal-information")({
  head: () => ({meta: [{title: m["account.personal_meta_title"]()}]}),
  component: PersonalInfoPage,
});
