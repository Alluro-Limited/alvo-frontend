import {createFileRoute} from "@tanstack/react-router";
import {DeliveryPage} from "@/pages/delivery";

export const Route = createFileRoute("/delivery/$id")({
  component: DeliveryPage,
});
