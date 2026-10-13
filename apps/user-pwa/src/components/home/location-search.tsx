import trackIconUrl from "@/assets/icon-track.svg";
import {m} from "@/paraglide/messages";

/** The bordered "Search for area" field at the top of the Change Location sheet. */
export function LocationSearch({value, onChange}: {value: string; onChange: (v: string) => void}) {
  return (
    <label className="mt-6 flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] border-grey-300 px-4 py-3.5 transition-colors focus-within:border-primary-500">
      <img src={trackIconUrl} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={m["loc.search"]()}
        placeholder={m["loc.search_ph"]()}
        className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] tracking-[0.14px] text-foreground placeholder:text-grey-500 focus:outline-none"
      />
    </label>
  );
}
