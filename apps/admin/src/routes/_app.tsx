import {createFileRoute, redirect} from "@tanstack/react-router";
import {isSignedIn} from "@/services/session";
import {AppShell} from "@/components/app-shell/app-shell";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!isSignedIn()) throw redirect({to: "/"});
  },
  component: AppShell,
});
