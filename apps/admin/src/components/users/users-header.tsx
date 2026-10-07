import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import wlExport from "@/assets/wl-export.svg";
import wlRefresh from "@/assets/wl-refresh.svg";

interface UsersHeaderProps {
  refreshing: boolean;
  exporting: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

/** Top row: the "User Management" title plus the Refresh and Export actions. */
export function UsersHeader({refreshing, exporting, onRefresh, onExport}: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl leading-[1.4] font-bold tracking-[0.2px] text-black">{m["users.title"]()}</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" isLoading={refreshing} onClick={onRefresh}>
          <img src={wlRefresh} alt="" className="size-4" aria-hidden="true" />
          {m["users.refresh"]()}
        </Button>
        <Button isLoading={exporting} onClick={onExport}>
          <img src={wlExport} alt="" className="size-4 brightness-0 invert" aria-hidden="true" />
          {m["users.export"]()}
        </Button>
      </div>
    </div>
  );
}
