import {createFileRoute} from "@tanstack/react-router";
import {NewShipmentPage} from "@/pages/new-shipment";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/new-shipment")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["nav.new_shipment"]()})}]}),
  component: NewShipmentPage,
});
