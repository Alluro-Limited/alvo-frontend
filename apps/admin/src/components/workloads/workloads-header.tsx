import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {WorkloadTab} from "@/types/workloads-types";
import wlExport from "@/assets/wl-export.svg";
import wlRefresh from "@/assets/wl-refresh.svg";
import {WorkloadsTabs} from "./workloads-tabs";

interface WorkloadsHeaderProps {
  tab: WorkloadTab;
  refreshing: boolean;
  exporting: boolean;
  onTab: (tab: WorkloadTab) => void;
  onRefresh: () => void;
  onExport: () => void;
}

/** Top row: the Single Send / Batches / Safe tabs plus the Refresh and Export actions. */
export function WorkloadsHeader({tab, refreshing, exporting, onTab, onRefresh, onExport}: WorkloadsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <WorkloadsTabs value={tab} onChange={onTab} />
      <div className="flex items-center gap-2">
        <Button variant="outline" isLoading={refreshing} onClick={onRefresh}>
          <img src={wlRefresh} alt="" className="size-4" aria-hidden="true" />
          {m["workloads.refresh"]()}
        </Button>
        <Button isLoading={exporting} onClick={onExport}>
          <img src={wlExport} alt="" className="size-4 brightness-0 invert" aria-hidden="true" />
          {m["workloads.export"]()}
        </Button>
      </div>
    </div>
  );
}
