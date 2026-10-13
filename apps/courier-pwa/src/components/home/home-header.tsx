import {Link} from "@tanstack/react-router";
import {Bell, ChevronDown, Siren} from "lucide-react";
import {m} from "@/paraglide/messages";
import {AvailabilityPill} from "./availability-pill";

interface HomeHeaderProps {
  firstName: string;
  area: string;
  live: boolean;
  unread: boolean;
  pending: boolean;
  onToggle: (live: boolean) => void;
}

/** Teal header: greeting + delivery area on the left, report/notifications tiles on the right, live pill below. */
export function HomeHeader({firstName, area, live, unread, pending, onToggle}: HomeHeaderProps) {
  return (
    <header className="bg-primary-500 px-6 pt-[calc(env(safe-area-inset-top)+24px)] pb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[15px] leading-[20px] font-medium text-white">{`${m["home.welcome"]()} ${firstName}`}</h1>
          <Link
            to="/delivery-area"
            aria-label={m["area.change"]()}
            className="mt-1 flex items-center gap-1 text-[15px] leading-[20px] text-white/90"
          >
            {m["home.area"]()} <span className="font-semibold text-white">{area}</span>
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="flex gap-2.5">
          <Link to="/support" aria-label={m["nav.support"]()} className="flex size-9 items-center justify-center rounded-[10px] bg-white">
            <Siren className="size-5 text-danger-500" aria-hidden="true" />
          </Link>
          <Link
            to="/notifications"
            aria-label={m["nav.notifications"]()}
            className="relative flex size-9 items-center justify-center rounded-[10px] bg-white"
          >
            <Bell className="size-5 text-primary-500" aria-hidden="true" />
            {unread && <span className="absolute top-2 right-2 size-2 rounded-full bg-success-500" aria-hidden="true" />}
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <AvailabilityPill live={live} pending={pending} onToggle={onToggle} />
      </div>
    </header>
  );
}
