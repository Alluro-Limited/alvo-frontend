import {useState} from "react";
import {PilledTabs} from "@/components/revenue/pilled-tabs";
import {RevenueNodesTab} from "@/components/revenue/revenue-nodes-tab";
import {RevenueOverviewTab} from "@/components/revenue/revenue-overview-tab";
import {m} from "@/paraglide/messages";
import type {ChartPeriod, RevenuePeriod} from "@/types/revenue-types";

type RevenueView = "overview" | "nodes";

const VIEWS: {value: RevenueView; label: string}[] = [
  {value: "overview", label: m["revenue.tab_overview"]()},
  {value: "nodes", label: m["revenue.tab_nodes"]()},
];

/** The Finance Revenue console — Overview analytics plus the Revenue by Node ranking. */
export function RevenuePage() {
  const [view, setView] = useState<RevenueView>("overview");
  const [period, setPeriod] = useState<RevenuePeriod>("year");
  const [trendPeriod, setTrendPeriod] = useState<ChartPeriod>("1y");
  const [flowPeriod, setFlowPeriod] = useState<ChartPeriod>("1y");
  const [nodePage, setNodePage] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <PilledTabs ariaLabel={m["revenue.tabs_aria"]()} value={view} options={VIEWS} onChange={setView} />
      {view === "overview" ? (
        <RevenueOverviewTab
          period={period}
          onPeriodChange={setPeriod}
          trendPeriod={trendPeriod}
          onTrendPeriodChange={setTrendPeriod}
          flowPeriod={flowPeriod}
          onFlowPeriodChange={setFlowPeriod}
        />
      ) : (
        <RevenueNodesTab page={nodePage} onPage={setNodePage} />
      )}
    </div>
  );
}
