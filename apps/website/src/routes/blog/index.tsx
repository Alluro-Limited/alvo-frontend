import {createFileRoute} from "@tanstack/react-router";

import {BlogIndex} from "@/components/blog/BlogIndex";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});
