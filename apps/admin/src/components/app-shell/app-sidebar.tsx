import {useState} from "react";
import {cn} from "cnfast";
import {SidebarFooter} from "./sidebar-footer";
import {SidebarHeader} from "./sidebar-header";
import {SidebarNav} from "./sidebar-nav";

/** Figma sidebar: 260px white rail with grouped navigation; collapses to an icon-only rail. */
export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-[260px] shrink-0 flex-col justify-between bg-white px-4 py-6 transition-[width]",
        collapsed && "w-[72px] items-center"
      )}
    >
      <div className="flex min-h-0 w-full flex-col gap-6">
        <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <SidebarNav collapsed={collapsed} />
      </div>
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
