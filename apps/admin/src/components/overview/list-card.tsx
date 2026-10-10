import type {ReactNode} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {PanelHeader} from "./panel-header";

interface ListCardProps {
  title: string;
  /** Rendered instead of the list when provided; also applies the empty-state height. */
  emptyState?: ReactNode;
  children: ReactNode;
}

/** Shared right-rail card: 52px header with "View all", then an empty state or a padded item list. */
export function ListCard({title, emptyState, children}: ListCardProps) {
  return (
    <section className={cn("flex flex-col overflow-clip rounded-xl bg-white pb-3", emptyState != null && "h-[270px]")} aria-label={title}>
      <PanelHeader title={title}>
        {/* No destination exists yet — renders as text until the list page lands. */}
        <span className="text-sm leading-[1.4] tracking-[0.14px] text-primary-500 opacity-80">{m["overview.view_all"]()}</span>
      </PanelHeader>
      {emptyState ?? <ul className="flex flex-col gap-2 px-3">{children}</ul>}
    </section>
  );
}
