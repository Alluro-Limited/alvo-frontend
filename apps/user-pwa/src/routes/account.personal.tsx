import {createFileRoute} from "@tanstack/react-router";
import {PersonalInfoPage} from "@/pages/personal-info";

export const Route = createFileRoute("/account/personal")({
  component: PersonalInfoPage,
});
