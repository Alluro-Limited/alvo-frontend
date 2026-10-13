import {Star, X} from "lucide-react";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {NodeList} from "./node-list";
import {NodeSearch} from "./node-search";
import {useNodeSheetFilters} from "./use-node-sheet";
import type {LockerNode} from "@/types/send-types";
import {m} from "@/paraglide/messages";
import locationIconUrl from "@/assets/icon-location.svg";

interface NodeSheetProps {
  open: boolean;
  nodes: LockerNode[];
  /** Node already picked for the other role — excluded from the list. */
  excludeId: string | null;
  favoriteId: string | null;
  onClose: () => void;
  onPick: (node: LockerNode) => void;
}

/** "Select Locker" sheet — search field, All/Near Me/Favorites chips, and the node list. */
export function NodeSheet({open, nodes, excludeId, favoriteId, onClose, onPick}: NodeSheetProps) {
  const {query, filter, needsLocation, visible, setQuery, setFilter, reset, allowLocation} = useNodeSheetFilters(
    nodes,
    excludeId,
    favoriteId
  );

  const close = () => {
    reset();
    onClose();
  };

  const pick = (node: LockerNode) => {
    onPick(node);
    close();
  };

  return (
    <AuthSheet open={open} onClose={close}>
      <div className="mt-2 flex h-[70dvh] w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["send.node_sheet"]()}</h2>
          <button type="button" onClick={close} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <NodeSearch query={query} filter={filter} onQuery={setQuery} onFilter={setFilter} />
        <div className="mt-1 flex flex-1 flex-col overflow-y-auto">
          {needsLocation ? (
            <LocatePrompt onAllow={allowLocation} />
          ) : filter === "favorites" && visible.length === 0 ? (
            <FavoritesEmpty />
          ) : (
            <NodeList nodes={visible} onPick={pick} />
          )}
        </div>
      </div>
    </AuthSheet>
  );
}

/** In-sheet geolocation consent shown by the "Near Me" chip before permission is granted. */
function LocatePrompt({onAllow}: {onAllow: () => void}) {
  return (
    <div className="flex w-full flex-col items-center gap-6 pt-10">
      <img src={locationIconUrl} alt="" aria-hidden="true" className="size-16" />
      <div className="flex w-full flex-col gap-2 text-center">
        <p className="text-[20px] font-medium leading-[1.2] text-foreground">{m["send.locate_title"]()}</p>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.locate_desc"]()}</p>
      </div>
      <Button className="w-full text-[16px] font-medium" onClick={onAllow}>
        {m["send.locate_allow"]()}
      </Button>
    </div>
  );
}

/** "No Favorites Yet" — shown when the Favorites chip has nothing saved. */
function FavoritesEmpty() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-10 text-center">
      <Star className="size-14 text-grey-300" aria-hidden="true" />
      <div className="flex w-full flex-col gap-2">
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["send.fav_none_title"]()}</p>
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["send.fav_none_desc"]()}</p>
      </div>
    </div>
  );
}
