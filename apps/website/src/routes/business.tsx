import {createFileRoute} from "@tanstack/react-router";

import {SmePage} from "@/pages/sme";

export const Route = createFileRoute("/business")({
  component: SmePage,
});
