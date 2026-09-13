import {createFileRoute} from "@tanstack/react-router";

import {SmartLockersPage} from "@/pages/smart-lockers";

export const Route = createFileRoute("/smart-lockers")({
  component: SmartLockersPage,
});
