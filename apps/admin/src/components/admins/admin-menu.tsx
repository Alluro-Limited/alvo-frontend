import {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger} from "@alvo/ui";
import {EllipsisVertical, Pencil, ShieldCheck, ShieldOff, Trash2} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {AdminStatus} from "@/types/admins-types";

interface AdminMenuProps {
  status: AdminStatus;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

/** The kebab menu on rows and in the detail drawer — edit, suspend/reactivate, delete. */
export function AdminMenu({status, onEdit, onSuspend, onReactivate, onDelete}: AdminMenuProps) {
  const suspended = status === "suspended";
  return (
    <Menu>
      <MenuTrigger
        className="flex size-8 items-center justify-center rounded-lg text-grey-600 transition-colors hover:bg-grey-100"
        aria-label={m["admins.menu_aria"]()}
      >
        <EllipsisVertical className="size-4" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner side="bottom" align="end" sideOffset={6}>
          <MenuPopup className="min-w-[200px]">
            <MenuItem className="text-grey-700" onClick={onEdit}>
              <Pencil className="size-4" aria-hidden="true" />
              {m["admins.menu_edit"]()}
            </MenuItem>
            <MenuItem
              className={cn(suspended ? "text-status-success-dark" : "text-status-fail")}
              onClick={suspended ? onReactivate : onSuspend}
            >
              {suspended ? <ShieldCheck className="size-4" aria-hidden="true" /> : <ShieldOff className="size-4" aria-hidden="true" />}
              {suspended ? m["admins.menu_reactivate"]() : m["admins.menu_suspend"]()}
            </MenuItem>
            <MenuItem className="text-status-fail" onClick={onDelete}>
              <Trash2 className="size-4" aria-hidden="true" />
              {m["admins.menu_delete"]()}
            </MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
