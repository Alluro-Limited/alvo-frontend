import {OTPField} from "@base-ui/react/otp-field";
import {cva} from "class-variance-authority";

import {cn} from "cnfast";

const pinInputContainer = cva("group/pin inline-flex items-center", {
  variants: {
    length: {
      4: "w-[200px] justify-between",
      6: "w-[314px] justify-between",
    },
  },
  defaultVariants: {
    length: 4,
  },
});

const slotClass =
  "size-12 rounded-full border border-transparent bg-transparent p-0 text-center text-5xl leading-none text-primary-800 outline-none transition-colors transition-shadow placeholder-shown:bg-grey-300 placeholder-shown:text-transparent focus:placeholder-shown:bg-primary-500 focus:ring-2 focus:ring-primary-500/50 data-[mask]:text-primary-500 data-[invalid]:bg-status-fail data-[invalid]:text-transparent data-[invalid]:placeholder-shown:bg-status-fail";

type PinInputProps = Omit<React.ComponentProps<typeof OTPField.Root>, "children" | "className" | "length"> & {
  length?: 4 | 6;
  invalid?: boolean;
  className?: string;
};

function PinInput({length = 4, mask, invalid, className, ...props}: PinInputProps) {
  return (
    <OTPField.Root data-slot="pin-input" length={length} mask={mask} className={cn(pinInputContainer({length}), className)} {...props}>
      {Array.from({length}).map((_, i) => (
        <OTPField.Input
          key={i}
          aria-label={`Digit ${i + 1} of ${length}`}
          placeholder=" "
          data-invalid={invalid ? "" : undefined}
          data-mask={mask ? "" : undefined}
          className={slotClass}
        />
      ))}
    </OTPField.Root>
  );
}

export {PinInput};
export type {PinInputProps};
