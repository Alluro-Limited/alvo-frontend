import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

export type SettingsTab = "general" | "payout" | "notification" | "security" | "privacy";

const ITEMS: {id: SettingsTab; label: () => string}[] = [
  {id: "general", label: m["settings.nav_general"]},
  {id: "payout", label: m["settings.nav_payout"]},
  {id: "notification", label: m["settings.nav_notification"]},
  {id: "security", label: m["settings.nav_security"]},
  {id: "privacy", label: m["settings.nav_privacy"]},
];

/** The left settings sub-nav — active item gets the light-teal pill from the Figma. */
export function SettingsNav({tab, onTab}: {tab: SettingsTab; onTab: (tab: SettingsTab) => void}) {
  return (
    <nav className="flex w-[245px] shrink-0 flex-col gap-1" aria-label={m["settings.title"]()}>
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
