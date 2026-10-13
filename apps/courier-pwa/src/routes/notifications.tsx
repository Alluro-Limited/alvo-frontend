import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {NotificationsPage} from "@/pages/notifications";

export const Route = createFileRoute("/notifications")({
  head: () => ({meta: [{title: m["notifications.meta_title"]()}]}),
  component: NotificationsPage,
});
