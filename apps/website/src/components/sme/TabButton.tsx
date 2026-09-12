import {smeFeatureTabsContent} from "@/content/sme";

export function TabButton({
  baseId,
  tab,
  active,
  onClick,
}: {
  baseId: string;
  tab: (typeof smeFeatureTabsContent.tabs)[number];
  active: boolean;
  onClick: () => void;
}) {
  const tabId = `${baseId}-tab-${tab.id}`;
  const panelId = `${baseId}-panel-${tab.id}`;
  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      className={`rounded-lg px-[18px] py-[10px] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-500/50 ${
        active
          ? "bg-primary-500 text-white shadow-md"
          : "border border-grey-300 text-grey-600 hover:border-primary-300 hover:text-primary-600"
      }`}
    >
      {tab.label}
    </button>
  );
}
