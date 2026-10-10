import {Ban, CheckCircle2, Clock, Package, type LucideIcon} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {PayoutMetrics} from "@/types/payouts-types";
import {formatCompactNaira} from "@/lib/format-revenue";

interface PayoutKpiSpec {
  title: () => string;
  value: number;
  sub: string;
  Icon: LucideIcon;
}

function kpiSpecs(metrics: PayoutMetrics): PayoutKpiSpec[] {
  return [
    {
      title: m["payout.kpi_total"],
      value: metrics.totalPayout,
      sub: m["payout.kpi_total_sub"]({count: metrics.courierCount}),
      Icon: Package,
    },
    {
      title: m["payout.kpi_paid"],
      value: metrics.paidAmount,
      sub: m["payout.kpi_paid_sub"]({paid: metrics.paidCouriers, total: metrics.courierCount}),
      Icon: CheckCircle2,
    },
    {
      title: m["payout.kpi_not_paid"],
      value: metrics.notPaidAmount,
      sub: m["payout.kpi_not_paid_sub"]({count: metrics.awaitingTransfer}),
      Icon: Clock,
    },
    {
      title: m["payout.kpi_withheld"],
      value: metrics.withheldAmount,
      sub: m["payout.kpi_withheld_sub"]({couriers: metrics.withheldCouriers, issues: metrics.withheldIssues}),
      Icon: Ban,
    },
  ];
}

/** The four payout KPI cards — same "KPI cards metrics" shape as the revenue console. */
export function PayoutMetricsCards({metrics}: {metrics: PayoutMetrics}) {
  return (
    <div data-testid="payout-kpi-grid" className="flex gap-2 rounded-[10px] bg-grey-100 p-2">
      {kpiSpecs(metrics).map(({title, value, sub, Icon}) => (
        <PayoutKpiCard key={title()} title={title()} value={value} sub={sub} Icon={Icon} />
      ))}
    </div>
  );
}

/** One KPI card — title + grey lucide chip over the small-₦/big-figure treatment. */
function PayoutKpiCard({title, value, sub, Icon}: {title: string; value: number; sub: string; Icon: LucideIcon}) {
  return (
    <div className="flex flex-1 items-start justify-between gap-2 rounded-xl border border-grey-300 bg-white p-3">
      <div className="flex min-w-0 flex-col gap-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{title}</p>
        <div className="flex flex-col gap-1.5">
          <p className="flex items-baseline gap-px text-primary-800">
            <span className="text-lg leading-[1.4] tracking-[0.18px]">₦</span>
            <span className="text-2xl leading-[1.2] font-bold tracking-[-0.24px]">{formatCompactNaira(value)}</span>
          </p>
          <p className="text-xs leading-[1.4] tracking-[0.24px] whitespace-nowrap text-grey-600">{sub}</p>
        </div>
      </div>
      <span className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-600">
        <Icon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}
