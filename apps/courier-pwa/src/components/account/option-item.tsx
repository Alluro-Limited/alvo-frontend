import {Link} from "@tanstack/react-router";
import {ChevronRight, type LucideIcon} from "lucide-react";

interface OptionItemProps {
  icon: LucideIcon;
  label: string;
  to?: "/personal-information" | "/notifications" | "/notification-settings" | "/support" | "/vehicle" | "/bank-account" | "/legal";
  danger?: boolean;
  onClick?: () => void;
}

/** One menu row inside an account card — icon + label + chevron; a link when `to` exists, else a button. */
export function OptionItem({icon: Icon, label, to, danger, onClick}: OptionItemProps) {
  const inner = (
    <>
      <span className="flex items-center gap-3">
        <Icon className={`size-5 ${danger ? "text-status-fail-dark" : ""}`} aria-hidden="true" />
        <span className={danger ? "text-status-fail-dark" : ""}>{label}</span>
      </span>
      {to && <ChevronRight className="size-5 text-grey-500" aria-hidden="true" />}
    </>
  );
  const cls = "flex w-full items-center justify-between py-3 text-left text-[14px]";
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
