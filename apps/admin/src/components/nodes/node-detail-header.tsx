import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {ArrowLeft, ChevronRight} from "lucide-react";
import {m} from "@/paraglide/messages";

interface NodeDetailHeaderProps {
  name?: string;
  onScheduleMaintenance: () => void;
  onChangeStatus: () => void;
}

/** Top bar: back link, breadcrumbs, and the two node actions. */
export function NodeDetailHeader({name, onScheduleMaintenance, onChangeStatus}: NodeDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          to="/nodes"
          className="flex items-center gap-1.5 text-sm leading-[1.4] font-medium tracking-[0.14px] text-grey-600 hover:text-primary-500"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {m["nodes.back_to_nodes"]()}
        </Link>
        {name && (
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <Link to="/nodes" className="hover:text-primary-500">
              {m["nav.nodes"]()}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-black">{name}</span>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onScheduleMaintenance}>
          {m["nodes.schedule_maintenance"]()}
        </Button>
        <Button onClick={onChangeStatus}>{m["nodes.change_status"]()}</Button>
      </div>
    </div>
  );
}
