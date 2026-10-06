import {ListChecks, Map as MapIcon} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

export type NodesView = "list" | "map";

const VIEWS: {value: NodesView; label: () => string; icon: typeof ListChecks}[] = [
  {value: "list", label: m["nodes.view_list"], icon: ListChecks},
  {value: "map", label: m["nodes.view_map"], icon: MapIcon},
];

/** The List/Map pill toggle above the nodes list. */
export function NodesViewTabs({value, onChange}: {value: NodesView; onChange: (view: NodesView) => void}) {
  return (
    <div className="flex h-10 items-center rounded-lg bg-white p-1" role="tablist" aria-label={m["nav.nodes"]()}>
      {VIEWS.map((view) => {
        const Icon = view.icon;
        const active = value === view.value;
        return (
          <button
            key={view.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(view.value)}
            className={cn(
              "flex h-full w-[114px] items-center justify-center gap-1.5 rounded-lg text-sm leading-[1.4] font-medium tracking-[0.14px]",
              active ? "bg-[#f6fdfd] text-primary-500" : "text-grey-600"
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {view.label()}
          </button>
        );
      })}
    </div>
  );
}
