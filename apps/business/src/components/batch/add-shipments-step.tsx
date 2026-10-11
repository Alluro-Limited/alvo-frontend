import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {CsvUpload} from "./csv-upload";
import {ManualGrid} from "./manual-grid";
import type {EntryTab} from "./use-batch-recipients";
import type {useBatchWizard} from "./use-batch-wizard";

const TABS: {id: EntryTab; label: () => string}[] = [
  {id: "csv", label: m["wiz.tab_csv"]},
  {id: "manual", label: m["wiz.tab_manual"]},
];

/** Step 2: pick between a CSV upload and the manual recipients grid. */
export function AddShipmentsStep({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg leading-[1.2] font-medium text-black">{m["wiz.step2"]()}</h2>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["wiz.add_sub"]()}</p>
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#f9f9f9] p-1" role="tablist" aria-label={m["wiz.step2"]()}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={wizard.recipients.entryTab === tab.id}
            onClick={() => wizard.recipients.setEntryTab(tab.id)}
            className={cn(
              "h-9 rounded-md text-sm leading-[1.4] font-medium tracking-[0.14px]",
              wizard.recipients.entryTab === tab.id ? "bg-primary-500 text-white" : "text-black"
            )}
          >
            {tab.label()}
          </button>
        ))}
      </div>
      {wizard.recipients.entryTab === "csv" ? <CsvUpload wizard={wizard} /> : <ManualGrid wizard={wizard} />}
    </div>
  );
}
