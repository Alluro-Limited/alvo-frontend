import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount, formatPct} from "@/lib/format-revenue";
import {useRevenueFlowQuery, useRevenueOverviewQuery, useRevenueTrendQuery, useServiceMixQuery} from "@/queries/use-revenue-queries";
import type {ChartPeriod, RevenueMetrics, RevenuePeriod} from "@/types/revenue-types";
import revBulkIcon from "@/assets/rev-bulk.svg";
import revLostIcon from "@/assets/rev-lost.svg";
import revNetIcon from "@/assets/rev-net.svg";
import revPartnerIcon from "@/assets/rev-partner.svg";
import revSingleIcon from "@/assets/rev-single.svg";
import revTotalIcon from "@/assets/rev-total.svg";
import revTransactionsIcon from "@/assets/rev-transactions.svg";
import revVolumeIcon from "@/assets/rev-volume.svg";
import {ChartCard} from "./chart-card";
import {PilledTabs} from "./pilled-tabs";
import {RevenueErrorCard} from "./revenue-error-card";
import {RevenueFlowChart} from "./revenue-flow-chart";
import {RevenueKpiCard} from "./revenue-kpi-card";
import {RevenueLostCard} from "./revenue-lost-card";
import {RevenueTrendChart} from "./revenue-trend-chart";
import {ServiceMixCard} from "./service-mix-card";

const PERIODS: {value: RevenuePeriod; label: string}[] = [
  {value: "today", label: m["revenue.period_today"]()},
  {value: "week", label: m["revenue.period_week"]()},
  {value: "month", label: m["revenue.period_month"]()},
  {value: "year", label: m["revenue.period_year"]()},
  {value: "all", label: m["revenue.period_all"]()},
  {value: "custom", label: m["revenue.period_custom"]()},
];

interface KpiSpec {
  title: string;
  value: string;
  money: boolean;
  sub: string;
  icon: string;
}

const pctSub = (value: number) => m["revenue.kpi_pct_of_total"]({pct: formatPct(value)});

/** Row one — headline totals. */
function headlineCards(metrics: RevenueMetrics): KpiSpec[] {
  return [
    {
      title: m["revenue.kpi_total"](),
      value: formatCompactNaira(metrics.totalRevenue),
      money: true,
      sub: m["revenue.kpi_total_sub"](),
      icon: revTotalIcon,
    },
    {
      title: m["revenue.kpi_net"](),
      value: formatCompactNaira(metrics.netRevenue),
      money: true,
      sub: pctSub(metrics.netPct),
      icon: revNetIcon,
    },
    {
      title: m["revenue.kpi_lost"](),
      value: formatCompactNaira(metrics.revenueLost),
      money: true,
      sub: m["revenue.kpi_lost_sub"](),
      icon: revLostIcon,
    },
    {
      title: m["revenue.kpi_volume"](),
      value: formatCount(metrics.packageVolume),
      money: false,
      sub: m["revenue.kpi_volume_sub"](),
      icon: revVolumeIcon,
    },
  ];
}

/** Row two — per-stream revenue plus the transaction count. */
function streamCards(metrics: RevenueMetrics): KpiSpec[] {
  return [
    {
      title: m["revenue.kpi_bulk"](),
      value: formatCompactNaira(metrics.bulkRevenue),
      money: true,
      sub: pctSub(metrics.bulkPct),
      icon: revBulkIcon,
    },
    {
      title: m["revenue.kpi_single"](),
      value: formatCompactNaira(metrics.singleRevenue),
      money: true,
      sub: pctSub(metrics.singlePct),
      icon: revSingleIcon,
    },
    {
      title: m["revenue.kpi_partner"](),
      value: formatCompactNaira(metrics.partnerFees, "0"),
      money: true,
      sub: pctSub(metrics.partnerPct),
      icon: revPartnerIcon,
    },
    {
      title: m["revenue.kpi_transactions"](),
      value: formatCount(metrics.transactions),
      money: false,
      sub: m["revenue.kpi_transactions_sub"](),
      icon: revTransactionsIcon,
    },
  ];
}

/** The eight KPI cards in Figma order — values formatted once, rendered uniformly. */
function kpiCards(metrics: RevenueMetrics): KpiSpec[] {
  return [...headlineCards(metrics), ...streamCards(metrics)];
}

/** The KPI grid — two rows of four, skeleton while the overview request lands. */
function KpiGrid({period}: {period: RevenuePeriod}) {
  const {data, isPending, isError, refetch} = useRevenueOverviewQuery(period);
  if (isError) return <RevenueErrorCard onRetry={() => void refetch()} />;
  const loading = isPending || data === undefined;
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" data-testid={loading ? "kpi-skeleton" : "kpi-grid"}>
      {loading
        ? Array.from({length: 8}, (_, i) => (
            <div key={`kpi-${i}`} className="h-[118px] animate-pulse rounded-xl border border-grey-300 bg-white" />
          ))
        : kpiCards(data.metrics).map((card) => <RevenueKpiCard key={card.title} {...card} />)}
    </div>
  );
}

/** Stacked-bar trend — owns its period pills, refetches independently. */
function TrendSection({period, onPeriodChange}: {period: ChartPeriod; onPeriodChange: (period: ChartPeriod) => void}) {
  const {data, isPending, isError, refetch} = useRevenueTrendQuery(period);
  return (
    <ChartCard title={m["revenue.trend_title"]()} period={period} onPeriodChange={onPeriodChange}>
      {isError ? (
        <RevenueErrorCard onRetry={() => void refetch()} />
      ) : isPending || data === undefined ? (
        <div className="h-[340px] animate-pulse rounded-lg bg-grey-100" data-testid="trend-skeleton" />
      ) : (
        <RevenueTrendChart points={data.points} />
      )}
    </ChartCard>
  );
}

/** The donut card — the Figma "Monthly" select maps to the chart period pills' 6m window. */
function MixSection() {
  const {data, isPending, isError, refetch} = useServiceMixQuery("6m");
  return isError ? (
    <RevenueErrorCard onRetry={() => void refetch()} />
  ) : isPending || data === undefined ? (
    <div className="h-[380px] w-[380px] animate-pulse rounded-xl border border-grey-300 bg-white" data-testid="mix-skeleton" />
  ) : (
    <ServiceMixCard mix={data} />
  );
}

/** The teal revenue/volume line chart. */
function FlowSection({period, onPeriodChange}: {period: ChartPeriod; onPeriodChange: (period: ChartPeriod) => void}) {
  const {data, isPending, isError, refetch} = useRevenueFlowQuery(period);
  return (
    <ChartCard title={m["revenue.trend_title"]()} period={period} onPeriodChange={onPeriodChange}>
      {isError ? (
        <RevenueErrorCard onRetry={() => void refetch()} />
      ) : isPending || data === undefined ? (
        <div className="h-[320px] animate-pulse rounded-lg bg-grey-100" data-testid="flow-skeleton" />
      ) : (
        <RevenueFlowChart points={data.points} />
      )}
    </ChartCard>
  );
}

/** The Revenue Lost breakdown — refetches with the page-level period. */
function LostSection({period}: {period: RevenuePeriod}) {
  const {data, isPending, isError, refetch} = useRevenueOverviewQuery(period);
  if (isError) return <RevenueErrorCard onRetry={() => void refetch()} />;
  if (isPending || data === undefined) {
    return <div className="h-[190px] animate-pulse rounded-xl border border-grey-300 bg-white" data-testid="lost-skeleton" />;
  }
  return <RevenueLostCard lost={data.lost} />;
}

interface RevenueOverviewTabProps {
  period: RevenuePeriod;
  onPeriodChange: (period: RevenuePeriod) => void;
  trendPeriod: ChartPeriod;
  onTrendPeriodChange: (period: ChartPeriod) => void;
  flowPeriod: ChartPeriod;
  onFlowPeriodChange: (period: ChartPeriod) => void;
}

/** Overview tab: period pills, KPI grid, trend + donut, flow line, lost breakdown. */
export function RevenueOverviewTab({
  period,
  onPeriodChange,
  trendPeriod,
  onTrendPeriodChange,
  flowPeriod,
  onFlowPeriodChange,
}: RevenueOverviewTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <PilledTabs ariaLabel={m["revenue.period_aria"]()} value={period} options={PERIODS} onChange={onPeriodChange} />
      </div>
      <KpiGrid period={period} />
      <div className="flex gap-4">
        <TrendSection period={trendPeriod} onPeriodChange={onTrendPeriodChange} />
        <MixSection />
      </div>
      <FlowSection period={flowPeriod} onPeriodChange={onFlowPeriodChange} />
      <LostSection period={period} />
    </div>
  );
}
