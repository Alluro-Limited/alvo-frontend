import safeIconUrl from "@/assets/icon-safe-box.svg";
import truckIconUrl from "@/assets/icon-truck.svg";
import {m} from "@/paraglide/messages";

const TILES = [
  {id: "send", icon: truckIconUrl, labelKey: "home.send"} as const,
  {id: "store", icon: safeIconUrl, labelKey: "home.store"} as const,
];

/** The two action tiles — Send Package / Store Items — on the tinted teal background. */
export function ActionTiles({onSend, onStore}: {onSend: () => void; onStore: () => void}) {
  return (
    <div className="flex w-full items-center gap-4">
      {TILES.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={tile.id === "send" ? onSend : onStore}
          className="flex h-full flex-1 flex-col items-center justify-center gap-2.5 overflow-clip rounded-[8px] bg-[rgba(6,127,138,0.08)] px-6 py-4"
        >
          <img src={tile.icon} alt="" aria-hidden="true" className="size-7" />
          <span className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-700 whitespace-nowrap">
            {m[tile.labelKey]()}
          </span>
        </button>
      ))}
    </div>
  );
}
