import {Menu as MenuPrimitive} from "@base-ui/react/menu";

import {cn} from "cnfast";

const Menu = MenuPrimitive.Root;
const MenuTrigger = MenuPrimitive.Trigger;
const MenuPortal = MenuPrimitive.Portal;

type MenuPositionerProps = React.ComponentProps<typeof MenuPrimitive.Positioner>;

function MenuPositioner({className, ...props}: MenuPositionerProps) {
  return <MenuPrimitive.Positioner className={cn("z-50", className)} {...props} />;
}

type MenuPopupProps = React.ComponentProps<typeof MenuPrimitive.Popup>;

function MenuPopup({className, ...props}: MenuPopupProps) {
  return (
    <MenuPrimitive.Popup
      data-slot="menu-popup"
      className={cn("min-w-[180px] rounded-lg border border-grey-200 bg-white p-1 shadow-lg outline-none", className)}
      {...props}
    />
  );
}

type MenuItemProps = React.ComponentProps<typeof MenuPrimitive.Item>;

function MenuItem({className, ...props}: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm leading-[1.4] tracking-[0.14px] outline-none data-[highlighted]:bg-grey-100 data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger};
export type {MenuItemProps, MenuPopupProps, MenuPositionerProps};
