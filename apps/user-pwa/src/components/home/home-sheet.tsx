import {cn} from "cnfast";
import {ActionTiles} from "./action-tiles";
import {HomeHeader} from "./home-header";
import {PromoBanner} from "./promo-banner";
import {RecentActivity} from "./recent-activity";
import {TrackInput} from "./track-input";
import {m} from "@/paraglide/messages";

interface HomeSheetProps {
  expanded: boolean;
  area: string;
  onToggle: () => void;
  onOpenLocation: () => void;
  onSend: () => void;
  onStore: () => void;
}

/**
 * The bottom sheet over the map. Collapsed it peeks with the header + track input so the
 * pins stay visible; expanded it shows the actions, promo banner, and recent activity.
 */
export function HomeSheet({expanded, area, onToggle, onOpenLocation, onSend, onStore}: HomeSheetProps) {
  return (
    <section
      className={cn(
        "absolute inset-x-0 bottom-0 flex flex-col gap-6 overflow-clip rounded-t-[32px] bg-white px-6 pt-3 pb-[86px] shadow-[0px_-2px_39px_11px_rgba(150,150,150,0.25)] transition-[height] duration-300",
        expanded ? "h-[calc(100dvh-107px)]" : "h-[168px]"
      )}
      aria-label={m["home.sheet"]()}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={expanded ? m["home.collapse"]() : m["home.expand"]()}
        className="mx-auto h-[7px] w-14 shrink-0 rounded-full bg-grey-300"
      />
      <HomeHeader area={area} onOpenLocation={onOpenLocation} />
      <TrackInput />
      {expanded ? (
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
          <ActionTiles onSend={onSend} onStore={onStore} />
          <PromoBanner />
          <RecentActivity />
        </div>
      ) : null}
    </section>
  );
}
