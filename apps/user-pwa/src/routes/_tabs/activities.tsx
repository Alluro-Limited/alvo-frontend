import {createFileRoute} from "@tanstack/react-router";
import {ActivitiesPage} from "@/pages/activities";

export const Route = createFileRoute("/_tabs/activities")({
  component: ActivitiesPage,
});
