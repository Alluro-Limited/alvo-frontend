import {createFileRoute, Outlet} from "@tanstack/react-router";
import {BottomNav} from "@/components/app/bottom-nav";

/** Pathless layout for the tabbed sections: every tab page shares the fixed bottom nav. */
export const Route = createFileRoute("/_tabs")({
  component: () => (
    <>
      <Outlet />
      <BottomNav />
    </>
  ),
});
