import {CircleAlert, CircleCheck} from "lucide-react";
import {cn} from "cnfast";

const tones = {
  success: {Icon: CircleCheck, className: "fill-primary-500"},
  warning: {Icon: CircleAlert, className: "fill-status-warning"},
} as const;

interface AuthStatusIconProps {
  tone: keyof typeof tones;
}

/** 64px filled glyph on a soft grey disc, heading the result screens (password updated, link sent, link expired). */
export function AuthStatusIcon({tone}: AuthStatusIconProps) {
  const {Icon, className} = tones[tone];
  return (
    <div data-tone={tone} className="flex size-16 shrink-0 items-center justify-center rounded-full bg-grey-100">
      <Icon aria-hidden="true" strokeWidth={1.5} className={cn("size-16 text-white", className)} />
    </div>
  );
}
