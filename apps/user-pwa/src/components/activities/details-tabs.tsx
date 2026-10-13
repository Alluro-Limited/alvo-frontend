import {Barcode, History, Info} from "lucide-react";
import type {ComponentType} from "react";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

export type DetailsAction = "info" | "access" | "timeline";

const TABS: {id: DetailsAction; label: SimpleMessage; Icon: ComponentType<{className?: string}>}[] = [
  {id: "info", label: "del.tab_details", Icon: Info},
  {id: "access", label: "del.tab_access", Icon: Barcode},
  {id: "timeline", label: "del.tab_timeline", Icon: History},
];

/** The three teal action tiles — Details → package info sheet, Access → code, Timeline → event sheet. */
export function DetailsTabs({onAction}: {onAction: (action: DetailsAction) => void}) {
  return (
    <div className="flex w-full items-stretch gap-3">
      {TABS.map(({id, label, Icon}) => (
        <button
          key={id}
          type="button"
          onClick={() => onAction(id)}
          className="flex flex-1 flex-col items-center gap-2 rounded-[6px] bg-[#f6fdfd] px-2 py-4"
        >
          <Icon className="size-5 text-primary-500" aria-hidden="true" />
          <span className="text-[12px] font-medium leading-[1.4] tracking-[0.02em] text-primary-500">{m[label]()}</span>
        </button>
      ))}
    </div>
  );
}
