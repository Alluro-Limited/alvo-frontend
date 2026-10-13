import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {DeliveryAreaPage} from "@/pages/delivery-area";

export const Route = createFileRoute("/delivery-area")({
  head: () => ({meta: [{title: m["area.title"]()}]}),
  component: DeliveryAreaPage,
});
