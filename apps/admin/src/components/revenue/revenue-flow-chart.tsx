import {useId, useMemo, useState} from "react";
import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount} from "@/lib/format-revenue";
import {ChartLegend} from "./chart-legend";
import {ChartTooltip} from "./chart-tooltip";
import {CHART_COLORS} from "./revenue-palette";
import type {RevenueFlowPoint} from "@/types/revenue-types";

const VIEW_W = 560;
const VIEW_H = 260;
const PAD_Y = 14;
const PAD_X = 12;

interface Hover {
  index: number;
  x: number;
  y: number;
}

/** Scales the series into SVG coordinates — line path, filled area, and per-point coords. */
function useFlowGeometry(points: RevenueFlowPoint[]) {
  return useMemo(() => {
    const max = Math.max(1, ...points.map((point) => point.revenue));
    const stepX = (VIEW_W - PAD_X * 2) / Math.max(1, points.length - 1);
    const coords = points.map((point, index) => ({
      x: PAD_X + index * stepX,
      y: PAD_Y + (1 - point.revenue / max) * (VIEW_H - PAD_Y * 2),
    }));
    const path = coords.map((pt, index) => `${index === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
    return {path, area: `${path} L${VIEW_W - PAD_X},${VIEW_H} L${PAD_X},${VIEW_H} Z`, coords};
  }, [points]);
}

interface FlowSvgProps {
  gradientId: string;
  path: string;
  area: string;
  coords: {x: number; y: number}[];
  hover: Hover | null;
  onMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  onLeave: () => void;
}

/** The SVG plot — gradient fill, teal line, and the hover crosshair + point ring. */
function FlowSvg({gradientId, path, area, coords, hover, onMove, onLeave}: FlowSvgProps) {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block w-full" onMouseMove={onMove} onMouseLeave={onLeave}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHART_COLORS.revenue} stopOpacity="0.22" />
          <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} data-testid="flow-area" />
      <path d={path} fill="none" stroke={CHART_COLORS.revenue} strokeWidth="2.5" strokeLinejoin="round" data-testid="flow-line" />
      {hover === null ? null : (
        <>
          <line
            x1={coords[hover.index].x}
            x2={coords[hover.index].x}
            y1={0}
            y2={VIEW_H}
            stroke="#98A2B3"
            strokeDasharray="4 4"
            data-testid="flow-crosshair"
          />
          <circle
            cx={coords[hover.index].x}
            cy={coords[hover.index].y}
            r="4.5"
            fill="white"
            stroke={CHART_COLORS.revenue}
            strokeWidth="2.5"
          />
        </>
      )}
    </svg>
  );
}

/** Nearest-bucket hit test — converts the mouse x into the closest point's percent position. */
function nearestHover(event: React.MouseEvent<SVGSVGElement>, coords: {x: number; y: number}[]): Hover {
  const rect = event.currentTarget.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / rect.width) * VIEW_W;
  let index = 0;
  coords.forEach((pt, i) => {
    if (Math.abs(pt.x - px) < Math.abs(coords[index].x - px)) index = i;
  });
  const pt = coords[index];
  return {index, x: (pt.x / VIEW_W) * 100, y: (pt.y / VIEW_H) * 100};
}

/** X-axis labels plus the Revenue / Volume legend row. */
function FlowAxis({points}: {points: RevenueFlowPoint[]}) {
  return (
    <>
      <div className="flex gap-3">
        {points.map((point) => (
          <span key={point.label} className="flex-1 text-center text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
            {point.label}
          </span>
        ))}
      </div>
      <ChartLegend
        items={[
          {color: CHART_COLORS.revenue, label: m["revenue.legend_revenue"]()},
          {color: CHART_COLORS.volume, label: m["revenue.legend_volume"]()},
        ]}
      />
    </>
  );
}

/** The teal revenue area line — nearest-point crosshair + tooltip on hover. */
export function RevenueFlowChart({points}: {points: RevenueFlowPoint[]}) {
  const gradientId = useId();
  const [hover, setHover] = useState<Hover | null>(null);
  const {path, area, coords} = useFlowGeometry(points);
  const active = hover === null ? null : points[hover.index];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative">
        <FlowSvg
          gradientId={gradientId}
          path={path}
          area={area}
          coords={coords}
          hover={hover}
          onMove={(event) => setHover(nearestHover(event, coords))}
          onLeave={() => setHover(null)}
        />
        {active === null || hover === null ? null : (
          <ChartTooltip
            title={active.label}
            left={`${hover.x}%`}
            top={`calc(${hover.y}% - 10px)`}
            rows={[
              {color: CHART_COLORS.revenue, label: m["revenue.legend_revenue"](), value: formatCompactNaira(active.revenue)},
              {
                color: CHART_COLORS.volume,
                label: m["revenue.legend_volume"](),
                value: m["revenue.tooltip_volume"]({count: formatCount(active.volume)}),
              },
            ]}
          />
        )}
      </div>
      <FlowAxis points={points} />
    </div>
  );
}
