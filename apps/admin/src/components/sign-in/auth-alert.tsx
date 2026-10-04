import type {ReactNode} from "react";
import {CircleCheck, OctagonAlert} from "lucide-react";
import {cn} from "cnfast";

const tones = {
  success: {
    Icon: CircleCheck,
    role: "status",
    className: "border-status-success bg-status-success-subtle text-status-success-dark",
  },
  error: {
    Icon: OctagonAlert,
    role: "alert",
    className: "border-status-fail-dark bg-status-fail-subtle text-status-fail-dark",
  },
} as const;

interface AuthAlertProps {
  tone: keyof typeof tones;
  children: ReactNode;
}

export function AuthAlert({tone, children}: AuthAlertProps) {
  const {Icon, role, className} = tones[tone];

  return (
    <div
      role={role}
      data-tone={tone}
      className={cn(
        "flex w-full items-center gap-2 rounded-[4px] border-l-2 p-4 text-xs leading-[1.4] font-medium tracking-[0.01em]",
        className
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
