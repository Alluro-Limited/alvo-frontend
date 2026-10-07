import {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import usersKebab from "@/assets/users-kebab.svg";
import usersMenuLock from "@/assets/users-menu-lock.svg";
import usersMenuDelete from "@/assets/users-menu-delete.svg";
import usersMenuFlag from "@/assets/users-menu-flag.svg";

interface SmeMenuProps {
  suspended: boolean;
  onFlag: () => void;
  onSuspend: () => void;
  onDeactivate: () => void;
}

/** Kebab menu in the SME drawer header — flag / suspend / deactivate. */
export function SmeMenu({suspended, onFlag, onSuspend, onDeactivate}: SmeMenuProps) {
  return (
    <Menu>
      <MenuTrigger
        className="flex size-8 items-center justify-center rounded-md text-grey-600 transition-colors hover:bg-grey-100"
        aria-label={m["smes.menu_aria"]()}
      >
        <img src={usersKebab} alt="" className="size-5" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner sideOffset={4} align="end">
          <MenuPopup className="min-w-[180px] rounded-lg border border-grey-200 bg-white py-1 shadow-lg">
            <MenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-grey-800 outline-none data-highlighted:bg-grey-100"
              onClick={onFlag}
            >
              <img src={usersMenuFlag} alt="" className="size-4" aria-hidden="true" />
              {m["smes.menu_flag"]()}
            </MenuItem>
            <MenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-grey-800 outline-none data-highlighted:bg-grey-100"
              onClick={onSuspend}
            >
              <img src={usersMenuLock} alt="" className="size-4" aria-hidden="true" />
              {suspended ? m["smes.menu_unsuspend"]() : m["smes.menu_suspend"]()}
            </MenuItem>
            <MenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-status-fail-dark outline-none data-highlighted:bg-grey-100"
              onClick={onDeactivate}
            >
              <img src={usersMenuDelete} alt="" className="size-4" aria-hidden="true" />
              {m["smes.menu_deactivate"]()}
            </MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
