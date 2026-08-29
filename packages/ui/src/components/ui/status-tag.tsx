import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "cnfast";

const statusTagVariants = cva(
  "inline-flex items-center gap-[5px] rounded-full border py-2 pl-2 pr-2.5 text-xs font-normal whitespace-nowrap",
  {
    variants: {
      status: {
        success: "border-status-success-dark bg-status-success-subtle text-status-success-dark",
        fail: "border-status-fail-dark bg-status-fail-subtle text-status-fail-dark",
        pending: "border-status-warning-dark bg-status-warning-subtle text-status-warning-dark",
        delayed: "border-status-delayed bg-status-delayed-subtle text-status-delayed",
        pickup: "border-teal-600 bg-teal-100/30 text-teal-600",
        booked: "border-secondary-500 bg-secondary-50 text-secondary-500",
        status7: "border-accent-500 bg-accent-50 text-accent-500",
        default: "border-neutral-500 bg-neutral-50 text-grey-600",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

type StatusTagProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> & VariantProps<typeof statusTagVariants>;

const statusLabels: Record<NonNullable<StatusTagProps["status"]>, string> = {
  success: "Active",
  fail: "Canceled",
  pending: "Canceled",
  delayed: "Delayed",
  pickup: "Delayed",
  booked: "Delayed",
  status7: "Delayed",
  default: "Active",
};

function StatusTag({className, status = "default", children, ...props}: StatusTagProps) {
  return (
    <span data-slot="status-tag" className={cn(statusTagVariants({status, className}))} {...props}>
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      <span>{children ?? statusLabels[status ?? "default"]}</span>
    </span>
  );
}

export {StatusTag};
export type {StatusTagProps};
