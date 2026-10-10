/**
 * Dataviz colors straight from the Figma spec — most sit outside the token scale,
 * so they live here as named constants rather than arbitrary values scattered
 * through the chart components.
 */
export const CHART_COLORS = {
  /** Stacked-bar series: dark teal Bulk, teal Single, orange Partner, red Lost. */
  bulk: "#008778",
  single: "#00A996",
  partner: "#FB923C",
  lost: "#F43F5E",
  /** Donut segments: blue Bulk, green Single, purple Partner. */
  mixBulk: "#3B82F6",
  mixSingle: "#10B981",
  mixPartner: "#8B5CF6",
  /** The area line + Revenue legend ring. */
  revenue: "#00A996",
  /** The Volume (pkgs) legend ring. */
  volume: "#0EA5E9",
  /** Ring used when the donut has no data. */
  mixEmpty: "#E4E7EC",
} as const;
