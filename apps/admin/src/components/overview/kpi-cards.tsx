import type {ReactNode} from "react";
import {ArrowUpRight} from "lucide-react";
import {cn} from "cnfast";
import kpiCouriersIcon from "@/assets/kpi-couriers.svg";
import kpiNodesIcon from "@/assets/kpi-nodes.svg";
import kpiParcelsIcon from "@/assets/kpi-parcels.svg";
import kpiRevenueIcon from "@/assets/kpi-revenue.svg";
import {formatNairaAmount} from "@/lib/format";
import {m} from "@/paraglide/messages";
import type {OverviewKpis} from "@/types/dashboard-types";

interface KpiBadge {
  tone: "success" | "warning";
  label: string;
}

const BADGE_TONES: Record<KpiBadge["tone"], string> = {
  success: "bg-[#f2fff7] text-status-success-dark",
  warning: "bg-status-warning-subtle text-status-warning-dark",
};

/** The card's bottom row: a plain grey note when empty, or a colored pill + caption when populated. */
function KpiNote({note, badge}: {note: string; badge?: KpiBadge}) {
  if (!badge) {
    return <p className="flex h-[22px] items-center text-xs leading-[1.4] tracking-[0.24px] text-grey-600">{note}</p>;
  }
  return (
    <div className="flex h-[22px] items-center gap-0.5">
      <span
        className={cn(
          "flex items-center gap-0.5 rounded-md p-0.5 text-xs leading-[1.4] font-medium tracking-[0.24px]",
          BADGE_TONES[badge.tone]
        )}
      >
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        {badge.label}
      </span>
      <span className="text-xs leading-[1.4] tracking-[0.24px] text-grey-600">{note}</span>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: ReactNode;
  note: string;
  badge?: KpiBadge;
  icon: string;
}

function KpiCard({label, value, note, badge, icon}: KpiCardProps) {
  return (
    <div className="flex flex-1 items-start justify-between overflow-clip rounded-xl border border-grey-300 bg-white p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{label}</p>
        <div className="flex w-full flex-col gap-2">
          <p className="text-2xl leading-[1.2] font-bold tracking-[-0.24px] text-primary-800">{value}</p>
          <KpiNote note={note} badge={badge} />
        </div>
      </div>
      <div className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-[#f9f9f9]">
        <img src={icon} alt="" className="size-4" />
      </div>
    </div>
  );
}

function deltaLabel(delta: number): string {
  return `${delta > 0 ? "+" : ""}${delta}%`;
}

function parcelsNote(kpis: OverviewKpis): string {
  if (kpis.parcelsDeltaPct != null) return m["overview.kpi_vs_yesterday"]();
  if (kpis.activeParcels === 0) return m["overview.kpi_parcels_empty"]();
  return m["overview.kpi_parcels_active"]({count: kpis.activeParcels});
}

function nodesNote(kpis: OverviewKpis): string {
  if (kpis.nodesUptimePct != null) return m["overview.kpi_uptime"]();
  if (kpis.nodesTotal === 0) return m["overview.kpi_nodes_empty"]();
  return m["overview.kpi_registered"]({count: kpis.nodesTotal});
}

function couriersNote(kpis: OverviewKpis): string {
  return kpis.couriersOffline != null
    ? m["overview.kpi_of_registered"]({count: kpis.couriersRegistered})
    : m["overview.kpi_registered"]({count: kpis.couriersRegistered});
}

function revenueNote(kpis: OverviewKpis): string {
  if (kpis.revenueDeltaPct != null) return m["overview.kpi_vs_yesterday"]();
  if (kpis.revenueToday === 0) return m["overview.kpi_revenue_empty"]();
  return m["overview.kpi_revenue_active"]();
}

/** The four-card metrics strip across the top of the overview. */
export function KpiCards({kpis}: {kpis: OverviewKpis}) {
  const cards: KpiCardProps[] = [
    {
      label: m["overview.kpi_parcels"](),
      value: kpis.activeParcels.toLocaleString(),
      note: parcelsNote(kpis),
      badge: kpis.parcelsDeltaPct != null ? {tone: "success", label: deltaLabel(kpis.parcelsDeltaPct)} : undefined,
      icon: kpiParcelsIcon,
    },
    {
      label: m["overview.kpi_nodes"](),
      value: `${kpis.nodesOnline}/${kpis.nodesTotal}`,
      note: nodesNote(kpis),
      badge: kpis.nodesUptimePct != null ? {tone: "success", label: `${kpis.nodesUptimePct}%`} : undefined,
      icon: kpiNodesIcon,
    },
    {
      label: m["overview.kpi_couriers"](),
      value: kpis.couriersActive.toLocaleString(),
      note: couriersNote(kpis),
      badge: kpis.couriersOffline != null ? {tone: "warning", label: m["overview.kpi_offline"]({count: kpis.couriersOffline})} : undefined,
      icon: kpiCouriersIcon,
    },
    {
      label: m["overview.kpi_revenue"](),
      value: (
        <>
          <span className="text-lg leading-[1.4] font-normal tracking-[0.18px]">₦</span>
          {formatNairaAmount(kpis.revenueToday)}
        </>
      ),
      note: revenueNote(kpis),
      badge: kpis.revenueDeltaPct != null ? {tone: "success", label: `${kpis.revenueDeltaPct}%`} : undefined,
      icon: kpiRevenueIcon,
    },
  ];

  return (
    <div className="flex gap-2 overflow-clip rounded-[10px] bg-[#f8fafc]" aria-label={m["nav.overview"]()}>
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
