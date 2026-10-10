import {Info, X} from "lucide-react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminDetail} from "@/types/admins-types";
import {useAdminDetailQuery} from "@/queries/use-admins-query";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {InfoRow} from "@/components/workloads/info-row";
import {CourierAvatar} from "@/components/couriers/courier-avatar";
import {AdminMenu} from "./admin-menu";
import {AdminRolePill, AdminStatusPill} from "./admin-pills";

interface AdminDrawerProps {
  adminId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

/** The 480px admin detail drawer — identity header, account details, module-access tiles, role hint. */
export function AdminDrawer({adminId, onClose, onEdit, onSuspend, onReactivate, onDelete}: AdminDrawerProps) {
  const detail = useAdminDetailQuery(adminId);
  return (
    <DrawerShell open={adminId !== null} onClose={onClose}>
      {adminId !== null && (
        <>
          {detail.isPending && <DrawerSkeleton />}
          {detail.isError && <p className="p-6 text-sm text-status-fail">{m["admins.drawer_error"]()}</p>}
          {detail.isSuccess && (
            <DrawerBody
              detail={detail.data}
              onClose={onClose}
              onEdit={onEdit}
              onSuspend={onSuspend}
              onReactivate={onReactivate}
              onDelete={onDelete}
            />
          )}
        </>
      )}
    </DrawerShell>
  );
}

interface DrawerBodyProps {
  detail: AdminDetail;
  onClose: () => void;
  onEdit: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

function DrawerBody({detail, onClose, onEdit, onSuspend, onReactivate, onDelete}: DrawerBodyProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <DrawerHeader
        detail={detail}
        onClose={onClose}
        onEdit={onEdit}
        onSuspend={onSuspend}
        onReactivate={onReactivate}
        onDelete={onDelete}
      />
      <DrawerSections detail={detail} />
    </div>
  );
}

function DrawerHeader({detail, onClose, onEdit, onSuspend, onReactivate, onDelete}: DrawerBodyProps) {
  return (
    <header className="border-b border-grey-200 bg-white px-6 py-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <CourierAvatar id={detail.id} name={detail.name} photoUrl={null} size="size-12" />
          <div>
            <h2 className="text-base leading-[1.4] font-semibold text-black">{detail.name}</h2>
            <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{detail.email}</p>
            <div className="flex items-center gap-2 pt-2">
              <AdminRolePill role={detail.role} />
              <AdminStatusPill status={detail.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <AdminMenu
            status={detail.status}
            onEdit={() => onEdit(detail.id)}
            onSuspend={() => onSuspend(detail.id)}
            onReactivate={() => onReactivate(detail.id)}
            onDelete={() => onDelete(detail.id)}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={m["workloads.close"]()}
            className="rounded p-1 text-grey-600 hover:bg-grey-100"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Button variant="outline" className="mt-4 w-full" onClick={() => onEdit(detail.id)}>
        {m["admins.edit"]()}
      </Button>
    </header>
  );
}

function DrawerSections({detail}: {detail: AdminDetail}) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <section className="rounded-xl border border-grey-200 bg-white p-4">
        <p className="pb-1 text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{m["admins.account_details"]()}</p>
        <InfoRow label={m["admins.admin_id"]()}>{detail.id}</InfoRow>
        <InfoRow label={m["admins.added_by"]()}>{detail.addedBy}</InfoRow>
        <InfoRow label={m["admins.date_added"]()}>{detail.addedAt}</InfoRow>
        <InfoRow label={m["admins.last_active"]()}>{detail.lastActive}</InfoRow>
      </section>
      <section className="rounded-xl border border-grey-200 bg-white p-4">
        <p className="pb-3 text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{m["admins.module_access"]()}</p>
        <div className="flex flex-col gap-2">
          {detail.moduleAccess.map((group) => (
            <div key={group.key} className="flex items-center justify-between rounded-lg bg-grey-100 px-3 py-2.5">
              <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-700">{group.label}</span>
              <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">
                {m["admins.module_count"]({granted: group.granted, total: group.total})}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="flex items-start gap-2.5 rounded-lg bg-secondary-50 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-secondary-500" aria-hidden="true" />
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-secondary-500">{detail.roleHint}</p>
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6" aria-busy="true">
      <div className="h-20 animate-pulse rounded-xl bg-white" />
      <div className="h-40 animate-pulse rounded-xl bg-white" />
      <div className="h-40 animate-pulse rounded-xl bg-white" />
    </div>
  );
}
