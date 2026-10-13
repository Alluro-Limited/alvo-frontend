import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {VehiclePage} from "@/pages/vehicle";

export const Route = createFileRoute("/vehicle")({
  head: () => ({meta: [{title: m["veh.meta_title"]()}]}),
  component: VehiclePage,
});
