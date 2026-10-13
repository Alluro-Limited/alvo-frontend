import {useState} from "react";
import {X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {AreaResults} from "./area-results";
import {LocationSearch} from "./location-search";
import {useAreaSearchQuery, useSetAreaMutation} from "@/queries/use-home-queries";
import {m} from "@/paraglide/messages";

interface LocationSheetProps {
  open: boolean;
  onClose: () => void;
}

/** "Change Location" sheet — area search with results, empty, and no-results states. */
export function LocationSheet({open, onClose}: LocationSheetProps) {
  const [query, setQuery] = useState("");
  const search = useAreaSearchQuery(query);
  const setArea = useSetAreaMutation();
  const searching = query.trim().length >= 2;

  const close = (area?: string) => {
    if (area) setArea.mutate(area);
    setQuery("");
    onClose();
  };

  return (
    <AuthSheet open={open} onClose={() => close()}>
      <div className="mt-2 flex h-[62dvh] w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-black">{m["loc.title"]()}</h2>
          <button type="button" onClick={() => close()} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <LocationSearch value={query} onChange={setQuery} />
        <div className="mt-4 flex flex-1 flex-col overflow-y-auto">
          <AreaResults
            query={query}
            searching={searching}
            resolved={search.isSuccess}
            results={search.data ?? []}
            onPick={(area) => close(area.split(",")[0]?.trim() ?? area)}
          />
        </div>
        <button
          type="button"
          onClick={() => close("Oshodi")}
          className="mt-4 flex h-[50px] w-full items-center justify-center rounded-[8px] border-[0.75px] border-primary-500 px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-500"
        >
          {m["loc.current"]()}
        </button>
      </div>
    </AuthSheet>
  );
}
