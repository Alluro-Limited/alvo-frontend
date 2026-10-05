import {Link} from "@tanstack/react-router";
import {PanelLeftClose, PanelLeftOpen} from "lucide-react";
import {cn} from "cnfast";
import logoMark from "@/assets/logo-mark.svg";
import {m} from "@/paraglide/messages";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** Brand mark + "Alvo" wordmark, with the collapse toggle; stacks vertically when collapsed. */
export function SidebarHeader({collapsed, onToggle}: SidebarHeaderProps) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <div className={cn("flex items-center justify-between pl-3", collapsed && "flex-col gap-4 pl-0")}>
      <Link to="/dashboard" aria-label="Alvo" className="flex items-center gap-1">
        <img src={logoMark} alt="" className="h-[17px] w-[14px]" />
        {!collapsed && <span className="text-xl leading-[1.2] font-medium text-black">Alvo</span>}
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? m["shell.expand_sidebar"]() : m["shell.collapse_sidebar"]()}
        className="text-grey-600 transition-colors hover:text-black"
      >
        <ToggleIcon aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
