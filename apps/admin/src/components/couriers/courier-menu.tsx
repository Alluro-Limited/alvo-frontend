import {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {CourierStatus} from "@/types/couriers-types";
import usersKebab from "@/assets/users-kebab.svg";
import usersMenuDelete from "@/assets/users-menu-delete.svg";
import usersMenuFlag from "@/assets/users-menu-flag.svg";
import usersMenuLock from "@/assets/users-menu-lock.svg";
import usersMenuUnlock from "@/assets/users-menu-unlock.svg";

interface CourierMenuProps {
  status: CourierStatus;
  onFlag: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}

/** The drawer's kebab menu — flag for review, suspend/unsuspend, delete account. */
export function CourierMenu({status, onFlag, onSuspend, onDelete}: CourierMenuProps) {
  const suspended = status === "suspended";
  return (
    <Menu>
      <MenuTrigger
        className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-grey-100"
        aria-label={m["couriers.menu_aria"]()}
      >
        <img src={usersKebab} alt="" className="size-4" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner side="bottom" align="end" sideOffset={6}>
          <MenuPopup className="min-w-[200px]">
            <MenuItem className="text-status-warning" onClick={onFlag}>
              <img src={usersMenuFlag} alt="" className="size-4" aria-hidden="true" />
              {m["couriers.menu_flag"]()}
            </MenuItem>
            <MenuItem className={cn(suspended ? "text-status-success-dark" : "text-status-fail")} onClick={onSuspend}>
              <img src={suspended ? usersMenuUnlock : usersMenuLock} alt="" className="size-4" aria-hidden="true" />
              {suspended ? m["couriers.menu_unsuspend"]() : m["couriers.menu_suspend"]()}
            </MenuItem>
            <MenuItem className="text-status-fail" onClick={onDelete}>
              <img src={usersMenuDelete} alt="" className="size-4" aria-hidden="true" />
              {m["couriers.menu_delete"]()}
            </MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
