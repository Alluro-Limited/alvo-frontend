import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import wlChevron from "@/assets/wl-chevron.svg";
import wlExport from "@/assets/wl-export.svg";
import wlRefresh from "@/assets/wl-refresh.svg";

interface BatchDetailTopbarProps {
  refreshing: boolean;
  exporting: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

/** Batch detail top row: "‹ Batches" back link plus Refresh and Export. */
export function BatchDetailTopbar({refreshing, exporting, onRefresh, onExport}: BatchDetailTopbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Link
        to="/workloads"
        search={{tab: "batches"}}
        className="flex items-center gap-1.5 text-sm leading-[1.4] font-medium tracking-[0.14px] text-grey-600 hover:text-primary-500"
      >
        <img src={wlChevron} alt="" className="size-3.5 rotate-180" aria-hidden="true" />
        {m["workloads.back_to_batches"]()}
      </Link>
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
