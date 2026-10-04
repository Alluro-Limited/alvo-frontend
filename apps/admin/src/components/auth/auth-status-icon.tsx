import {CircleCheck, TriangleAlert} from "lucide-react";
import {cn} from "cnfast";

const tones = {
  success: {Icon: CircleCheck, className: "fill-status-success"},
  warning: {Icon: TriangleAlert, className: "fill-status-warning"},
} as const;

interface AuthStatusIconProps {
  tone: keyof typeof tones;
}

/** 64px filled glyph for result screens (password updated, link sent, link expired). */
export function AuthStatusIcon({tone}: AuthStatusIconProps) {
  const {Icon, className} = tones[tone];
  return <Icon data-tone={tone} aria-hidden="true" strokeWidth={1.5} className={cn("size-16 shrink-0 text-white", className)} />;
}
