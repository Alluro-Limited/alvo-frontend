import {Select as SelectPrimitive} from "@base-ui/react/select";
import {Check, ChevronDown} from "lucide-react";

import {cn} from "cnfast";

const Select = SelectPrimitive.Root;
const SelectPortal = SelectPrimitive.Portal;
const SelectValue = SelectPrimitive.Value;
const SelectItemText = SelectPrimitive.ItemText;

type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger>;

function SelectTrigger({className, children, ...props}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "group flex h-[50px] w-full items-center justify-between gap-2 rounded-lg border border-grey-300 bg-background px-4 text-left text-base text-foreground outline-none transition-all placeholder:text-grey-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 data-[placeholder]:text-grey-600 data-[popup-open]:border-primary-500 data-[popup-open]:ring-2 data-[popup-open]:ring-primary-500/50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 aria-[invalid=true]:border-status-fail aria-[invalid=true]:focus:ring-status-fail/50",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

type SelectIconProps = React.ComponentProps<typeof SelectPrimitive.Icon>;

function SelectIcon({className, children, ...props}: SelectIconProps) {
  return (
    <SelectPrimitive.Icon
      data-slot="select-icon"
      className={cn("text-foreground transition-transform group-data-[popup-open]:rotate-180", className)}
      {...props}
    >
      {children ?? <ChevronDown className="size-5" strokeWidth={1.5} aria-hidden="true" />}
    </SelectPrimitive.Icon>
  );
}

type SelectPositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>;

function SelectPositioner({className, alignItemWithTrigger = false, sideOffset = 4, ...props}: SelectPositionerProps) {
  return (
    <SelectPrimitive.Positioner
      alignItemWithTrigger={alignItemWithTrigger}
      sideOffset={sideOffset}
      className={cn("z-50 w-[var(--anchor-width)]", className)}
      {...props}
    />
  );
}

type SelectPopupProps = React.ComponentProps<typeof SelectPrimitive.Popup>;

function SelectPopup({className, ...props}: SelectPopupProps) {
  return (
    <SelectPrimitive.Popup
      data-slot="select-popup"
      className={cn(
        "max-h-[var(--available-height)] w-full overflow-y-auto rounded-lg border border-grey-200 bg-white p-1 shadow-lg outline-none",
        "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-[ending-style]:-translate-y-1 data-[starting-style]:-translate-y-1 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

function SelectItem({className, children, ...props}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-2.5 text-sm leading-[1.4] tracking-[0.14px] text-foreground outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-grey-100",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  );
}

type SelectItemIndicatorProps = React.ComponentProps<typeof SelectPrimitive.ItemIndicator>;

function SelectItemIndicator({className, children, ...props}: SelectItemIndicatorProps) {
  return (
    <SelectPrimitive.ItemIndicator data-slot="select-item-indicator" className={cn("text-primary-500", className)} {...props}>
      {children ?? <Check className="size-4" aria-hidden="true" />}
    </SelectPrimitive.ItemIndicator>
  );
}

export {
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
};
export type {SelectIconProps, SelectItemIndicatorProps, SelectItemProps, SelectPopupProps, SelectPositionerProps, SelectTriggerProps};
