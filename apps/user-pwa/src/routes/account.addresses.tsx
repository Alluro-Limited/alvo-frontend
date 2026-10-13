import {createFileRoute} from "@tanstack/react-router";
import {AddressesPage} from "@/pages/addresses";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});
