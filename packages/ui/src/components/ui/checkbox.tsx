import {Checkbox as CheckboxPrimitive} from "@base-ui/react/checkbox";

import {cn} from "cnfast";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

function Checkbox({className, ...props}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox relative inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border border-grey-300 bg-background transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 data-[checked]:border-primary-500 data-[checked]:bg-primary-500 data-[unchecked]:border-grey-300 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <svg
          viewBox="0 0 14 14"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7 L6 10 L11 4" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export {Checkbox};
export type {CheckboxProps};
