import {Outlet} from "@tanstack/react-router";
import {AppSidebar} from "./app-sidebar";
import {AppTopbar} from "./app-topbar";

/**
 * Authenticated app frame: the 260px sidebar, the 64px top nav, and the page content.
 * Auth pages stay outside this layout; every section under `/dashboard` and the
 * placeholder destinations renders inside it.
 */
export function AppShell() {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
