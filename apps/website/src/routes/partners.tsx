import {createFileRoute} from "@tanstack/react-router";

import {PartnersPage} from "@/pages/partners";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
});
