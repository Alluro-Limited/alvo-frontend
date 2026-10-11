import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {SettingsTab} from "@/types/settings-types";

const TABS: {id: SettingsTab; label: () => string}[] = [
  {id: "user", label: m["settings.tab_user"]},
  {id: "business", label: m["settings.tab_business"]},
  {id: "notifications", label: m["settings.tab_notifications"]},
  {id: "security", label: m["settings.tab_security"]},
];

interface SettingsTabsProps {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

/** The centered 4-item sub-menu: teal-tinted active item over muted grey items. */
export function SettingsTabs({active, onChange}: SettingsTabsProps) {
  return (
    <div role="tablist" aria-label={m["settings.tabs_label"]()} className="flex w-full max-w-[542px]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded px-4 py-2 text-sm leading-[1.4] tracking-[0.14px] transition-colors",
            active === tab.id ? "bg-[#aaebf1]/30 font-medium text-primary-500" : "bg-grey-100 text-black hover:bg-grey-200"
          )}
        >
          {tab.label()}
        </button>
      ))}
    </div>
  );
}
