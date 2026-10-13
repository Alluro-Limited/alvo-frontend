import {createFileRoute} from "@tanstack/react-router";
import {TrackPage} from "@/pages/track";

export const Route = createFileRoute("/delivery/$id/track")({
  component: TrackPage,
});
