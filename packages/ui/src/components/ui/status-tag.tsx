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
        delayed: "border-status-delayed-dark bg-status-delayed-subtle text-status-delayed-dark",
        pickup: "border-primary-600 bg-primary-100/30 text-primary-600",
        booked: "border-secondary-500 bg-secondary-50 text-secondary-500",
        default: "border-neutral-500 bg-neutral-50 text-grey-600",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

type StatusTagProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color" | "children"> &
  VariantProps<typeof statusTagVariants> & {
    children: React.ReactNode;
  };

function StatusTag({className, status = "default", children, ...props}: StatusTagProps) {
  return (
    <span data-slot="status-tag" className={cn(statusTagVariants({status, className}))} {...props}>
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

export {StatusTag};
export type {StatusTagProps};
