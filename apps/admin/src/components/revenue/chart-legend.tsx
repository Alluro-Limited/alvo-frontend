import {cn} from "cnfast";

/** The ring-style legend dot — white center with a 4px colored stroke, per the Figma legend component. */
export function LegendDot({color}: {color: string}) {
  return <span className="size-3 shrink-0 rounded-full border-[3px] bg-white" style={{borderColor: color}} aria-hidden="true" />;
}

export interface LegendItem {
  color: string;
  label: string;
}

/** A legend row — ring dot + caption text, used under the bar chart and beside the donut. */
export function ChartLegend({items, className}: {items: LegendItem[]; className?: string}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-2", className)}>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <LegendDot color={item.color} />
          <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
