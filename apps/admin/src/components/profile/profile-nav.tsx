import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

export type ProfileTab = "personal" | "security" | "notification" | "session";

const ITEMS: {id: ProfileTab; label: () => string}[] = [
  {id: "personal", label: m["profile.nav_personal"]},
  {id: "security", label: m["profile.nav_security"]},
  {id: "notification", label: m["profile.nav_notification"]},
  {id: "session", label: m["profile.nav_session"]},
];

/** The left profile sub-nav — same pill treatment as the settings nav. */
export function ProfileNav({tab, onTab}: {tab: ProfileTab; onTab: (tab: ProfileTab) => void}) {
  return (
    <nav className="flex w-[245px] shrink-0 flex-col gap-1" aria-label={m["profile.title"]()}>
      {ITEMS.map(({id, label}) => (
        <button
          key={id}
          type="button"
          aria-current={tab === id ? "page" : undefined}
          onClick={() => onTab(id)}
          className={cn(
            "rounded-lg px-4 py-3 text-left text-sm leading-[1.4] tracking-[0.14px] transition-colors",
            tab === id ? "bg-primary-50 font-medium text-primary-600" : "text-grey-600 hover:bg-grey-100"
          )}
        >
          {label()}
        </button>
      ))}
    </nav>
  );
}
