import trackIconUrl from "@/assets/icon-track.svg";
import {m} from "@/paraglide/messages";

/** "Track: #PKG123…" input row shown at the top of the home sheet. */
export function TrackInput() {
  return (
    <label className="flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] border-grey-300 px-4 py-3.5 transition-colors focus-within:border-primary-500">
      <img src={trackIconUrl} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
      <input
        type="text"
        aria-label={m["home.track"]()}
        placeholder={m["home.track_ph"]()}
        className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] tracking-[0.14px] text-foreground placeholder:text-grey-500 focus:outline-none"
      />
    </label>
  );
}
