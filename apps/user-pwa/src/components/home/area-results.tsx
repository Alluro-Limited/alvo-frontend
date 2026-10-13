import pinTealUrl from "@/assets/icon-pin-teal.svg";
import noResultsUrl from "@/assets/no-results-pin.svg";
import type {AreaResult} from "@/types/home-types";
import {m} from "@/paraglide/messages";

interface AreaResultsProps {
  query: string;
  searching: boolean;
  resolved: boolean;
  results: AreaResult[];
  onPick: (area: string) => void;
}

/** Result rows / no-results state inside the Change Location sheet. */
export function AreaResults({query, searching, resolved, results, onPick}: AreaResultsProps) {
  if (searching && resolved && results.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <img src={noResultsUrl} alt="" aria-hidden="true" className="size-14" />
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-black">{m["loc.none"]()}</p>
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{m["loc.none_desc"]({query})}</p>
      </div>
    );
  }
  if (!searching || results.length === 0) return null;
  return (
    <ul className="flex w-full flex-col">
      {results.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            aria-label={r.address}
            onClick={() => onPick(r.area)}
            className="flex w-full items-start gap-2 border-b-[0.5px] border-grey-200 py-3 text-left"
          >
            <img src={pinTealUrl} alt="" aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <span className="flex flex-col">
              <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500">{r.address}</span>
              <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{r.area}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
