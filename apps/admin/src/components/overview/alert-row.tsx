import {cn} from "cnfast";
import alertCloseError from "@/assets/alert-close-error.svg";
import alertCloseSuccess from "@/assets/alert-close-success.svg";
import alertCloseWarning from "@/assets/alert-close-warning.svg";
import alertErrorIcon from "@/assets/alert-error.svg";
import alertSuccessIcon from "@/assets/alert-success.svg";
import alertWarningIcon from "@/assets/alert-warning.svg";
import {m} from "@/paraglide/messages";
import type {AlertSeverity, OverviewAlert} from "@/types/dashboard-types";

const TONES: Record<AlertSeverity, {bg: string; text: string; icon: string; close: string}> = {
  success: {bg: "bg-[#f2fff7]", text: "text-status-success-dark", icon: alertSuccessIcon, close: alertCloseSuccess},
  warning: {bg: "bg-status-warning-subtle", text: "text-status-warning-dark", icon: alertWarningIcon, close: alertCloseWarning},
  error: {bg: "bg-status-fail-subtle", text: "text-status-fail-dark", icon: alertErrorIcon, close: alertCloseError},
};

/** One dismissible alert row in the Alerts rail card. */
export function AlertRow({alert, onDismiss}: {alert: OverviewAlert; onDismiss: () => void}) {
  const tone = TONES[alert.severity];
  return (
    <li className={cn("flex h-[54px] items-start justify-between rounded-lg px-4 py-2", tone.bg)}>
      <div className="flex items-start gap-2">
        <div className="flex items-center py-[3px]">
          <img src={tone.icon} alt="" className="size-4" />
        </div>
        <div className={cn("flex flex-col justify-center text-xs leading-[1.4] tracking-[0.12px]", tone.text)}>
          <p className="font-medium">{alert.title}</p>
          <p>{alert.description}</p>
        </div>
      </div>
      <button type="button" onClick={onDismiss} aria-label={m["overview.alert_dismiss"]()} className="size-4 shrink-0 cursor-pointer">
        <img src={tone.close} alt="" className="size-4" />
      </button>
    </li>
  );
}
