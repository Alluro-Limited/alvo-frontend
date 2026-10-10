import type {ReactNode} from "react";
import {m} from "@/paraglide/messages";
import {PilledTabs} from "./pilled-tabs";
import type {ChartPeriod} from "@/types/revenue-types";

const CHART_PERIODS: {value: ChartPeriod; label: string}[] = [
  {value: "1w", label: m["revenue.chart_1w"]()},
  {value: "6m", label: m["revenue.chart_6m"]()},
  {value: "1y", label: m["revenue.chart_1y"]()},
  {value: "custom", label: m["revenue.chart_custom"]()},
];

interface ChartCardProps {
  title: string;
  /** The `1w / 6m / 1y / Custom` pill row — the chart's own period filter. */
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  children: ReactNode;
}

/** Card shell for the charts — grey header (title + pill filter), white body. */
export function ChartCard({title, period, onPeriodChange, children}: ChartCardProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-grey-300 bg-white">
      <header className="flex items-center justify-between gap-3 bg-grey-50 px-3 py-4">
        <h2 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{title}</h2>
        <PilledTabs
          variant="plain"
          ariaLabel={m["revenue.chart_filter_aria"]()}
          value={period}
          options={CHART_PERIODS}
          onChange={onPeriodChange}
        />
      </header>
      <div className="flex min-h-0 flex-1 flex-col p-3">{children}</div>
    </section>
  );
}
