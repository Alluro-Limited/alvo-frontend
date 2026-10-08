import {cn} from "cnfast";
import {ChevronDown} from "lucide-react";
import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount, formatPct} from "@/lib/format-revenue";
import {LegendDot} from "./chart-legend";
import {CHART_COLORS} from "./revenue-palette";
import type {ServiceMixKey, ServiceMixResponse} from "@/types/revenue-types";

const RADIUS = 78;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Small white seams between segments, per the Figma ring. */
const GAP = 4;

interface SliceStyle {
  color: string;
  chipBg: string;
  label: string;
}

const SLICES: Record<ServiceMixKey, SliceStyle> = {
  bulk: {color: CHART_COLORS.mixBulk, chipBg: "bg-secondary-50", label: m["revenue.legend_bulk"]()},
  single: {color: CHART_COLORS.mixSingle, chipBg: "bg-success-50", label: m["revenue.legend_single"]()},
  partner: {color: CHART_COLORS.mixPartner, chipBg: "bg-accent-50", label: m["revenue.legend_partner"]()},
};

const ORDER: ServiceMixKey[] = ["bulk", "single", "partner"];

/** One donut arc — dash offset walks the ring so segments join seamlessly. */
function Slice({pct, offset, color}: {pct: number; offset: number; color: string}) {
  const dash = Math.max(0, (pct / 100) * CIRCUMFERENCE - GAP);
  return (
    <circle
      cx="100"
      cy="100"
      r={RADIUS}
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
      strokeDashoffset={-((offset / 100) * CIRCUMFERENCE - GAP / 2)}
      transform="rotate(-90 100 100)"
      data-testid="donut-slice"
    />
  );
}

/** Legend rings + the tinted amount chips under the donut. */
function MixStats({byKey}: {byKey: Map<ServiceMixKey, {amount: number; pct: number}>}) {
  return (
    <>
      <div className="flex items-center gap-5">
        {ORDER.map((key) => (
          <span key={key} className="flex items-center gap-2" data-testid={`mix-legend-${key}`}>
            <LegendDot color={SLICES[key].color} />
            <span className="text-xs text-grey-600">
              {SLICES[key].label} - {formatPct(byKey.get(key)?.pct ?? 0)}
            </span>
          </span>
        ))}
      </div>
      <div className="flex w-full gap-2">
        {ORDER.map((key) => (
          <span
            key={key}
            className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs", SLICES[key].chipBg)}
            data-testid={`mix-chip-${key}`}
          >
            <span className="font-medium" style={{color: SLICES[key].color}}>
              {SLICES[key].label}
            </span>
            <span className="text-primary-800">{formatCompactNaira(byKey.get(key)?.amount ?? 0)}</span>
          </span>
        ))}
      </div>
    </>
  );
}

/** Donut + center total + legend + value chips — all driven by the service-mix response. */
export function ServiceMixCard({mix}: {mix: ServiceMixResponse}) {
  const byKey = new Map(mix.segments.map((segment) => [segment.key, segment]));
  let offset = 0;
  const arcs = ORDER.map((key) => {
    const arc = {key, pct: byKey.get(key)?.pct ?? 0, offset};
    offset += arc.pct;
    return arc;
  });

  return (
    <section
      data-testid="service-mix-card"
      className="flex w-[380px] shrink-0 flex-col overflow-hidden rounded-xl border border-grey-300 bg-white"
    >
      <header className="flex items-center justify-between gap-3 bg-grey-50 px-3 py-4">
        <h2 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{m["revenue.mix_title"]()}</h2>
        <span className="flex h-9 items-center gap-2 rounded-lg border border-grey-300 bg-white px-3 text-sm text-grey-700">
          {m["revenue.mix_monthly"]()}
          <ChevronDown className="size-4" aria-hidden="true" />
        </span>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="size-[200px]" data-testid="service-mix-donut">
            {mix.segments.length === 0 ? (
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke={CHART_COLORS.mixEmpty} strokeWidth={STROKE} />
            ) : (
              arcs.map((arc) => <Slice key={arc.key} pct={arc.pct} offset={arc.offset} color={SLICES[arc.key].color} />)
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[32px] leading-[1.2] font-bold text-primary-800" data-testid="service-mix-total">
              {formatCount(mix.total)}
            </span>
            <span className="text-xs text-grey-500">{m["revenue.mix_total"]()}</span>
          </div>
        </div>
        <MixStats byKey={byKey} />
      </div>
    </section>
  );
}
