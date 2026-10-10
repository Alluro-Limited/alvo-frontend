import {useMemo, useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {formatCompactNaira} from "@/lib/format-revenue";
import {ChartLegend} from "./chart-legend";
import {ChartTooltip} from "./chart-tooltip";
import {CHART_COLORS} from "./revenue-palette";
import type {RevenueTrendPoint} from "@/types/revenue-types";

const BAR_HEIGHT = 280;

interface Segment {
  key: "bulk" | "single" | "partner" | "lost";
  label: string;
  color: string;
}

/** Stack order bottom → top: Bulk, Single, Partner, Lost. */
const SEGMENTS: Segment[] = [
  {key: "bulk", label: m["revenue.legend_bulk"](), color: CHART_COLORS.bulk},
  {key: "single", label: m["revenue.legend_single"](), color: CHART_COLORS.single},
  {key: "partner", label: m["revenue.legend_partner"](), color: CHART_COLORS.partner},
  {key: "lost", label: m["revenue.legend_lost"](), color: CHART_COLORS.lost},
];

/** DOM order for the column — flex-col paints top→down, so Lost leads and Bulk sits at the base. */
const PAINT_ORDER = [...SEGMENTS].reverse();

function totalOf(point: RevenueTrendPoint) {
  return point.bulk + point.single + point.partner + point.lost;
}

/** One monthly column — stacked segments sized against the largest total in the series. */
function TrendBar({
  point,
  maxTotal,
  hovered,
  onHover,
}: {
  point: RevenueTrendPoint;
  maxTotal: number;
  hovered: boolean;
  onHover: (hovering: boolean) => void;
}) {
  const total = totalOf(point);
  return (
    <button
      type="button"
      data-testid={`trend-bar-${point.label}`}
      aria-label={point.label}
      onMouseEnter={() => onHover(true)}
      onFocus={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onBlur={() => onHover(false)}
      className="relative flex h-full flex-1 cursor-default flex-col items-center justify-end"
    >
      <span
        data-testid="trend-crosshair"
        aria-hidden="true"
        className={cn("absolute inset-y-0 w-px border-l border-dashed border-grey-400", !hovered && "hidden")}
      />
      <span className="flex w-full max-w-[55px] flex-col justify-end gap-px" style={{height: BAR_HEIGHT}}>
        {total === 0 ? (
          <span className="h-[3px] w-full rounded-t-sm" style={{backgroundColor: CHART_COLORS.bulk}} aria-hidden="true" />
        ) : (
          PAINT_ORDER.map((segment, index) => (
            <span
              key={segment.key}
              data-testid={`trend-segment-${segment.key}`}
              aria-hidden="true"
              className={index === 0 ? "w-full rounded-t-[4px]" : "w-full"}
              style={{height: Math.max(0, Math.round((point[segment.key] / maxTotal) * BAR_HEIGHT)), backgroundColor: segment.color}}
            />
          ))
        )}
      </span>
    </button>
  );
}

interface RevenueTrendChartProps {
  points: RevenueTrendPoint[];
}

/** Stacked monthly columns — hover any column for the dashed crosshair + black tooltip. */
export function RevenueTrendChart({points}: RevenueTrendChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxTotal = useMemo(() => Math.max(1, ...points.map(totalOf)), [points]);
  const active = hovered === null ? null : points[hovered];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative flex items-stretch gap-3" style={{height: BAR_HEIGHT}}>
        {points.map((point, index) => (
          <TrendBar
            key={point.label}
            point={point}
            maxTotal={maxTotal}
            hovered={hovered === index}
            onHover={(hovering) => setHovered(hovering ? index : null)}
          />
        ))}
        {active === null || hovered === null ? null : (
          <ChartTooltip
            title={active.label}
            left={`${((hovered + 0.5) / points.length) * 100}%`}
            top={`${BAR_HEIGHT - Math.round((totalOf(active) / maxTotal) * BAR_HEIGHT) - 8}px`}
            rows={SEGMENTS.map((segment) => ({color: segment.color, label: segment.label, value: formatCompactNaira(active[segment.key])}))}
          />
        )}
      </div>
      <div className="flex gap-3">
        {points.map((point) => (
          <span key={point.label} className="flex-1 text-center text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
            {point.label}
          </span>
        ))}
      </div>
      <ChartLegend items={SEGMENTS} />
    </div>
  );
}
