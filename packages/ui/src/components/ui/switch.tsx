import {Switch as SwitchPrimitive} from "@base-ui/react/switch";

import {cn} from "cnfast";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

function Switch({className, ...props}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch relative inline-flex h-6 w-[39px] shrink-0 cursor-pointer rounded-full border border-transparent bg-grey-300 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 data-[checked]:bg-primary-500 data-[unchecked]:bg-grey-300 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-[15px] data-[unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
}

export {Switch};
export type {SwitchProps};
