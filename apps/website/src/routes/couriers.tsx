import {createFileRoute} from "@tanstack/react-router";

import {CourierPage} from "@/pages/courier";

export const Route = createFileRoute("/couriers")({
  component: CourierPage,
});
