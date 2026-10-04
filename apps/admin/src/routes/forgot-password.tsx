import {createFileRoute} from "@tanstack/react-router";
import {NotFoundPage} from "@/pages/not-found";

// Placeholder so the sign-in link resolves; the forgot-password flow replaces it once its designs land.
export const Route = createFileRoute("/forgot-password")({
  component: NotFoundPage,
});
