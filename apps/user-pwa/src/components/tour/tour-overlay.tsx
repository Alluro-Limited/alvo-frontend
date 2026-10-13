import {cn} from "cnfast";
import {BottomNav} from "@/components/app/bottom-nav";
import {HomeHeader} from "@/components/home/home-header";
import {TourTip} from "./tour-tip";
import type {TourSpotlight, TourStep} from "./tour-steps";
import safeIconUrl from "@/assets/icon-safe-box.svg";
import truckIconUrl from "@/assets/icon-truck.svg";
import {m} from "@/paraglide/messages";

const TILE_ICONS = {send: truckIconUrl, store: safeIconUrl} as const;

/** A copy of one action tile, re-rendered above the scrim as the spotlight. */
function SpotTile({tile, className}: {tile: "send" | "store"; className: string}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute flex flex-col items-center justify-center gap-2.5 overflow-clip rounded-[8px] bg-[rgba(6,127,138,0.08)]",
        className
      )}
    >
      <img src={TILE_ICONS[tile]} alt="" aria-hidden="true" className="size-7" />
      <span className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-700 whitespace-nowrap">
        {m[tile === "send" ? "home.send" : "home.store"]()}
      </span>
    </div>
  );
}

/** The element copied above the scrim for this step, positioned to match the real layout. */
function Spotlight({target, area}: {target: TourSpotlight; area: string}) {
  switch (target) {
    case "header":
      return (
        <div className="pointer-events-none absolute top-[55px] left-6 w-[342px]">
          <HomeHeader area={area} onOpenLocation={() => undefined} />
        </div>
      );
    case "send":
      return <SpotTile tile="send" className="top-[182px] left-6 h-[94px] w-[165px]" />;
    case "store":
      return <SpotTile tile="store" className="top-[181px] left-[201px] h-[94px] w-[165px]" />;
    case "nav":
      return <BottomNav />;
  }
}

interface TourOverlayProps {
  step: TourStep;
  area: string;
  onSkip: () => void;
  onNext: () => void;
}

/** Dim the home screen, lift the step's target above the scrim, and show its tooltip. */
export function TourOverlay({step, area, onSkip, onNext}: TourOverlayProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative mx-auto h-full w-full max-w-[390px]">
        <Spotlight target={step.spotlight} area={area} />
        <TourTip step={step} onSkip={onSkip} onNext={onNext} />
      </div>
    </div>
  );
}
