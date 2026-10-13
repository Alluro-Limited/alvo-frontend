import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {NotificationSettingsPage} from "@/pages/notification-settings";

export const Route = createFileRoute("/notification-settings")({
  head: () => ({meta: [{title: m["notif.meta_title"]()}]}),
  component: NotificationSettingsPage,
});
