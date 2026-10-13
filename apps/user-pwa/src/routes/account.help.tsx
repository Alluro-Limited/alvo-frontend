import {createFileRoute} from "@tanstack/react-router";
import {GetHelpPage} from "@/pages/get-help";

export const Route = createFileRoute("/account/help")({
  component: GetHelpPage,
});
