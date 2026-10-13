import {createFileRoute} from "@tanstack/react-router";
import {SupportPage} from "@/pages/support";

export const Route = createFileRoute("/_tabs/support")({
  component: SupportPage,
});
