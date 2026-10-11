import {OTPField} from "@base-ui/react/otp-field";
import {cva} from "class-variance-authority";

import {cn} from "cnfast";

const pinInputContainer = cva("group/pin inline-flex items-center", {
  variants: {
    length: {
      4: "w-[200px] justify-between",
      5: "gap-3",
      6: "w-[314px] justify-between",
    },
  },
  defaultVariants: {
    length: 4,
  },
});

const pinSlot = cva("p-0 text-center outline-none transition-colors transition-shadow", {
  variants: {
    variant: {
      circle:
        "size-12 rounded-full border border-transparent bg-transparent text-5xl leading-none text-primary-800 placeholder-shown:bg-grey-300 placeholder-shown:text-transparent focus:placeholder-shown:bg-primary-500 focus:ring-2 focus:ring-primary-500/50 data-[mask]:text-primary-500 data-[invalid]:bg-status-fail data-[invalid]:text-transparent data-[invalid]:placeholder-shown:bg-status-fail",
      box: "size-[50px] rounded-[4px] border border-grey-400 bg-grey-100 text-base leading-[1.4] font-medium text-foreground shadow-[0px_2px_8px_0px_rgba(6,127,138,0.05)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 data-[invalid]:border-status-fail data-[invalid]:bg-status-fail-subtle data-[invalid]:shadow-[0px_2px_8px_0px_rgba(6,127,138,0.12)]",
    },
  },
  defaultVariants: {
    variant: "circle",
  },
});

type PinInputProps = Omit<React.ComponentProps<typeof OTPField.Root>, "children" | "className" | "length"> & {
  length?: 4 | 5 | 6;
  /** `circle` is the large round style; `box` is the 50px square cell used on sign-up. */
  variant?: "circle" | "box";
  /** Accessible name for the group — labels the first slot, which can't take its own `aria-label`. */
  label?: string;
  invalid?: boolean;
  className?: string;
};

function PinInput({length = 4, variant = "circle", label, mask, invalid, className, ...props}: PinInputProps) {
  const slots = (
    <OTPField.Root data-slot="pin-input" length={length} mask={mask} className={cn(pinInputContainer({length}), className)} {...props}>
      {Array.from({length}).map((_, i) => (
        <OTPField.Input
          key={i}
          aria-label={i === 0 ? undefined : `Digit ${i + 1} of ${length}`}
          placeholder=" "
          data-invalid={invalid ? "" : undefined}
          data-mask={mask ? "" : undefined}
          className={pinSlot({variant})}
        />
      ))}
    </OTPField.Root>
  );
  if (!label) return slots;
  return (
    <label className="contents">
      <span className="sr-only">{label}</span>
      {slots}
    </label>
  );
}

export {PinInput};
export type {PinInputProps};
