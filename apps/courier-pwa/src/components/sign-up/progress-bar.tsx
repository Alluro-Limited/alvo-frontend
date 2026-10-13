import {cn} from "cnfast";

interface ProgressBarProps {
  /** 1-based step within the 4 application steps. */
  step: number;
}

/** The 4-segment indicator from the wizard header, 108×4px per the design. */
export function ProgressBar({step}: ProgressBarProps) {
  return (
    <div className="flex w-[108px] gap-1" aria-hidden="true">
      {[1, 2, 3, 4].map((segment) => (
        <span key={segment} className={cn("h-1 flex-1 rounded-full", segment <= step ? "bg-primary-500" : "bg-grey-300")} />
      ))}
    </div>
  );
}
