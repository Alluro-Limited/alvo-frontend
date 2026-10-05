import {NAV_SECTIONS} from "./nav-config";
import {SidebarNavItem} from "./sidebar-nav-item";

/** The grouped sidebar links: section labels hidden when collapsed to the icon rail. */
export function SidebarNav({collapsed}: {collapsed: boolean}) {
  return (
    <nav className="flex w-full flex-col gap-4 overflow-y-auto">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label()} className="flex w-full flex-col gap-1">
          {!collapsed && <p className="px-3 py-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{section.label()}</p>}
          {section.items.map((item) => (
            <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>
      ))}
    </nav>
  );
}
