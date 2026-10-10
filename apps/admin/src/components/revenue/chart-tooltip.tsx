interface TooltipRow {
  color: string;
  label: string;
  value: string;
}

interface ChartTooltipProps {
  title: string;
  rows: TooltipRow[];
  /** CSS `left` inside the chart — the caller anchors it over the hovered bucket. */
  left: string;
  /** CSS `top` — combine with the -100% Y translate so the card floats above the point. */
  top: string;
}

/** The black hover card — period title over colored series rows, per the Figma tooltip. */
export function ChartTooltip({title, rows, left, top}: ChartTooltipProps) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col gap-0.5 rounded-md bg-black px-3 py-2"
      style={{left, top}}
    >
      <p className="text-xs leading-[1.4] font-medium text-white">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="flex items-center gap-1.5 text-xs leading-[1.4] whitespace-nowrap">
          <span className="font-medium" style={{color: row.color}}>
            {row.label}:
          </span>
          <span className="text-white">{row.value}</span>
        </p>
      ))}
    </div>
  );
}
