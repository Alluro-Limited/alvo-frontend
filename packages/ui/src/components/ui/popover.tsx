import {Popover as PopoverPrimitive} from "@base-ui/react/popover";

import {cn} from "cnfast";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverPortal = PopoverPrimitive.Portal;
const PopoverClose = PopoverPrimitive.Close;

type PopoverPositionerProps = React.ComponentProps<typeof PopoverPrimitive.Positioner>;

function PopoverPositioner({className, ...props}: PopoverPositionerProps) {
  return <PopoverPrimitive.Positioner className={cn("z-50", className)} {...props} />;
}

type PopoverPopupProps = React.ComponentProps<typeof PopoverPrimitive.Popup>;

function PopoverPopup({className, ...props}: PopoverPopupProps) {
  return (
    <PopoverPrimitive.Popup data-slot="popover-popup" className={cn("rounded-xl bg-white shadow-lg outline-none", className)} {...props} />
  );
}

export {Popover, PopoverClose, PopoverPopup, PopoverPortal, PopoverPositioner, PopoverTrigger};
export type {PopoverPopupProps, PopoverPositionerProps};
