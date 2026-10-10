import {useState} from "react";
import {X} from "lucide-react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {AdminDetail, RoleOption, UpdateAdminInput} from "@/types/admins-types";
import {usePermissionCatalogQuery} from "@/queries/use-admins-query";
import {AdminInfoFields} from "./admin-info-fields";
import {PermissionTree} from "./permission-tree";
import {useAdminPermissionForm} from "./use-invite-form";

type EditTab = "account" | "permissions";

const EDIT_TABS: {id: EditTab; label: () => string}[] = [
  {id: "account", label: m["admins.tab_account"]},
  {id: "permissions", label: m["admins.tab_permissions"]},
];

interface EditAdminDialogProps {
  detail: AdminDetail | null;
  roles: RoleOption[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateAdminInput) => void;
}

/** Two-tab edit dialog (Account Info / Roles & Permission) prefilled from the drawer detail. */
export function EditAdminDialog({detail, roles, submitting, failed, onClose, onSubmit}: EditAdminDialogProps) {
  return (
    <Dialog open={detail !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[640px] max-w-[calc(100vw-32px)] p-6">
          {detail !== null && (
            <EditForm
              key={detail.id}
              detail={detail}
              roles={roles}
              submitting={submitting}
              failed={failed}
              onClose={onClose}
              onSubmit={onSubmit}
            />
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

interface EditFormProps extends Omit<EditAdminDialogProps, "detail"> {
  detail: AdminDetail;
}

function EditForm({detail, roles, submitting, failed, onClose, onSubmit}: EditFormProps) {
  const catalog = usePermissionCatalogQuery(true);
  const [tab, setTab] = useState<EditTab>("account");
  const state = useAdminPermissionForm({
    initialForm: {firstName: detail.firstName, lastName: detail.lastName, email: detail.email, role: detail.role},
    initialGranted: detail.permissions,
    presets: catalog.data?.presets,
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["admins.edit_title"]()}</DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
            {m["admins.edit_note"]()}
          </DialogDescription>
        </div>
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <X className="size-5" aria-hidden="true" />
        </DialogClose>
      </div>
      <EditTabBar tab={tab} onTab={setTab} />
      {tab === "account" ? (
        <div className="pt-5">
          <AdminInfoFields form={state.form} roles={roles} disabled={submitting} onChange={state.patchForm} />
        </div>
      ) : (
        <EditPermissionsTab catalog={catalog} state={state} submitting={submitting} />
      )}
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["admins.edit_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          {m["admins.edit_discard"]()}
        </Button>
        <Button isLoading={submitting} disabled={!state.complete} onClick={() => state.submit(onSubmit)}>
          {submitting ? m["admins.edit_saving"]() : m["admins.edit_save"]()}
        </Button>
      </div>
    </>
  );
}

function EditTabBar({tab, onTab}: {tab: EditTab; onTab: (tab: EditTab) => void}) {
  return (
    <div className="mt-5 flex gap-6 border-b border-grey-200" role="tablist">
      {EDIT_TABS.map(({id, label}) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onTab(id)}
          className={cn(
            "border-b-2 pb-2 text-sm leading-[1.4] tracking-[0.14px] transition-colors",
            tab === id ? "border-primary-500 font-medium text-primary-600" : "border-transparent text-grey-500 hover:text-grey-700"
          )}
        >
          {label()}
        </button>
      ))}
    </div>
  );
}

function EditPermissionsTab({
  catalog,
  state,
  submitting,
}: {
  catalog: ReturnType<typeof usePermissionCatalogQuery>;
  state: ReturnType<typeof useAdminPermissionForm>;
  submitting: boolean;
}) {
  return (
    <div className="max-h-[420px] overflow-y-auto pt-2">
      {catalog.isPending && (
        <div className="flex flex-col gap-4 py-4" aria-busy="true">
          {Array.from({length: 5}, (_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-grey-100" />
          ))}
        </div>
      )}
      {catalog.isError && <p className="py-8 text-center text-sm text-status-fail">{m["admins.permissions_error"]()}</p>}
      {catalog.isSuccess && (
        <PermissionTree modules={catalog.data.modules} granted={state.granted} disabled={submitting} onChange={state.setGranted} />
      )}
    </div>
  );
}
