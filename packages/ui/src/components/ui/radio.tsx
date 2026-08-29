import {Radio as RadioPrimitive} from "@base-ui/react/radio";
import {RadioGroup as RadioGroupPrimitive} from "@base-ui/react/radio-group";

import {cn} from "cnfast";

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive>;

type RadioProps = React.ComponentProps<typeof RadioPrimitive.Root>;

function RadioGroup({className, ...props}: RadioGroupProps) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function Radio({className, ...props}: RadioProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "group/radio relative inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border border-grey-300 bg-background transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 data-[checked]:border-teal-500 data-[checked]:bg-teal-500 data-[unchecked]:border-grey-300 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-white" />
    </RadioPrimitive.Root>
  );
}

export {RadioGroup, Radio};
export type {RadioGroupProps, RadioProps};
