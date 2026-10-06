import {cn} from "cnfast";
import wlChevron from "@/assets/wl-chevron.svg";

export const FIELD_CLASSES =
  "h-10 w-full appearance-none rounded-lg border-[0.75px] border-grey-300 bg-white px-4 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none focus:border-primary-500";

interface SelectShellProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  wrapperClassName?: string;
  /** Value-based change handler — receives `select.value`, not the event. */
  onChange?: (value: string) => void;
}

/** Styled native select wrapper shared by the toolbar filters and the flag modal. */
export function SelectShell({children, className, wrapperClassName, onChange, ...props}: SelectShellProps) {
  return (
    <div className={cn("relative flex-1", wrapperClassName)}>
      <select
        {...props}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(FIELD_CLASSES, "cursor-pointer pr-9", className)}
      >
        {children}
      </select>
      <img src={wlChevron} alt="" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" aria-hidden="true" />
    </div>
  );
}
