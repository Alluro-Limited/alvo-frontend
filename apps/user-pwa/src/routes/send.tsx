import {createFileRoute} from "@tanstack/react-router";
import {SendPage} from "@/pages/send";

export const Route = createFileRoute("/send")({
  component: SendPage,
});
