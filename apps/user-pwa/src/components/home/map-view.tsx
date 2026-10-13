import type {LockerPin} from "@/types/home-types";
import mapUrl from "@/assets/map-home.png";
import {m} from "@/paraglide/messages";

interface MapViewProps {
  lockers: LockerPin[];
  onPick: (id: string) => void;
}

/** The static map artwork with interactive pin badges positioned over it. */
export function MapView({lockers, onPick}: MapViewProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <img src={mapUrl} alt="" className="h-full w-full object-cover" />
      <div className="pointer-events-auto absolute inset-0">
        {lockers.map((pin) => (
          <button
            key={pin.id}
            type="button"
            aria-label={m["home.locker"]({id: pin.label})}
            onClick={() => onPick(pin.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{left: `${pin.x}%`, top: `${pin.y}%`}}
          >
            <span
              className="flex h-[23px] min-w-[42px] items-center justify-center rounded-full px-1.5 text-[14px] font-bold tracking-[0.28px] text-white shadow-[0px_3px_6px_rgba(0,0,0,0.2)]"
              style={{backgroundColor: pin.color, color: pin.color === "#fffcf7" ? "#00655a" : "#ffffff"}}
            >
              {pin.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
