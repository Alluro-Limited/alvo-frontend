import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {WorkloadTab} from "@/types/workloads-types";
import tabBatches from "@/assets/tab-batches.svg";
import tabPackage from "@/assets/tab-package.svg";
import tabSafe from "@/assets/tab-safe.svg";

const TABS: {id: WorkloadTab; label: () => string; icon: string; ready: boolean}[] = [
  {id: "single", label: m["workloads.tab_single"], icon: tabPackage, ready: true},
  {id: "batches", label: m["workloads.tab_batches"], icon: tabBatches, ready: true},
  {id: "safe", label: m["workloads.tab_safe"], icon: tabSafe, ready: false},
];

interface WorkloadsTabsProps {
  value: WorkloadTab;
  onChange: (tab: WorkloadTab) => void;
}

/** The pilled Single Send / Batches / Safe switcher. Batches and Safe stay disabled until their designs land. */
export function WorkloadsTabs({value, onChange}: WorkloadsTabsProps) {
  return (
    <div className="flex h-10 items-start rounded-lg bg-white p-1" role="tablist" aria-label={m["nav.workloads"]()}>
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={!tab.ready}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex h-full items-center justify-center gap-1.5 rounded-lg p-2.5 text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap",
              active ? "border-[0.5px] border-grey-100 bg-[#f6fdfd] text-primary-500" : "text-grey-600",
              !tab.ready && "cursor-not-allowed opacity-60"
            )}
          >
            <img src={tab.icon} alt="" className="size-3.5" aria-hidden="true" />
            {tab.label()}
          </button>
        );
      })}
    </div>
  );
}
