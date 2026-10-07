import {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {UserStatus} from "@/types/users-types";
import usersKebab from "@/assets/users-kebab.svg";
import usersMenuDelete from "@/assets/users-menu-delete.svg";
import usersMenuFlag from "@/assets/users-menu-flag.svg";
import usersMenuLock from "@/assets/users-menu-lock.svg";
import usersMenuUnlock from "@/assets/users-menu-unlock.svg";

interface UserMenuProps {
  status: UserStatus;
  /** Total parcels sent — shown on the "View all items" entry. */
  parcelCount: number;
  onViewItems: () => void;
  onFlag: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}

/** The drawer's kebab menu — view items, flag for review, suspend/unsuspend, delete account. */
export function UserMenu({status, parcelCount, onViewItems, onFlag, onSuspend, onDelete}: UserMenuProps) {
  const suspended = status === "suspended";
  return (
    <Menu>
      <MenuTrigger
        className="flex size-10 items-center justify-center rounded-lg bg-grey-100 transition-colors hover:bg-grey-200"
        aria-label={m["users.menu_aria"]()}
      >
        <img src={usersKebab} alt="" className="size-4" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner side="bottom" align="end" sideOffset={6}>
          <MenuPopup className="min-w-[200px]">
            <MenuItem className="text-grey-700" onClick={onViewItems}>
              {m["users.menu_view_items"]({count: parcelCount})}
            </MenuItem>
            <MenuItem className="text-status-warning" onClick={onFlag}>
              <img src={usersMenuFlag} alt="" className="size-4" aria-hidden="true" />
              {m["users.menu_flag"]()}
            </MenuItem>
            <MenuItem className={cn(suspended ? "text-status-success-dark" : "text-status-fail")} onClick={onSuspend}>
              <img src={suspended ? usersMenuUnlock : usersMenuLock} alt="" className="size-4" aria-hidden="true" />
              {suspended ? m["users.menu_unsuspend"]() : m["users.menu_suspend"]()}
            </MenuItem>
            <MenuItem className="text-status-fail" onClick={onDelete}>
              <img src={usersMenuDelete} alt="" className="size-4" aria-hidden="true" />
              {m["users.menu_delete"]()}
            </MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
