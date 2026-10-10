import {X} from "lucide-react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {InviteAdminInput, RoleOption} from "@/types/admins-types";
import {usePermissionCatalogQuery} from "@/queries/use-admins-query";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {AdminInfoFields} from "./admin-info-fields";
import {PermissionTree} from "./permission-tree";
import {useAdminPermissionForm} from "./use-invite-form";

interface InviteAdminDrawerProps {
  open: boolean;
  roles: RoleOption[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: InviteAdminInput) => void;
}

/** The 895px invite drawer — Info form on the left, permission tree on the right. */
export function InviteAdminDrawer({open, roles, submitting, failed, onClose, onSubmit}: InviteAdminDrawerProps) {
  return (
    <DrawerShell open={open} onClose={onClose} className="w-[895px]">
      {open && <InviteForm roles={roles} submitting={submitting} failed={failed} onClose={onClose} onSubmit={onSubmit} />}
    </DrawerShell>
  );
}

function InviteForm({roles, submitting, failed, onClose, onSubmit}: Omit<InviteAdminDrawerProps, "open">) {
  const catalog = usePermissionCatalogQuery(true);
  const state = useAdminPermissionForm({
    initialForm: {firstName: "", lastName: "", email: "", role: ""},
    initialGranted: [],
    presets: catalog.data?.presets,
  });
  const ready = state.complete && catalog.isSuccess;

  return (
    <>
      <header className="flex items-start justify-between border-b border-grey-200 bg-white px-6 py-5">
        <div>
          <h2 className="text-xl leading-[1.3] font-semibold text-black">{m["admins.invite_title"]()}</h2>
          <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["admins.invite_subtitle"]()}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={m["workloads.close"]()} className="rounded p-1 text-grey-600 hover:bg-grey-100">
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>
      <InviteBody catalog={catalog} roles={roles} submitting={submitting} state={state} />
      <footer className="flex flex-col gap-3 border-t border-grey-200 bg-white px-6 py-4">
        {failed && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["admins.invite_error"]()}</p>}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {m["admins.invite_cancel"]()}
          </Button>
          <Button isLoading={submitting} disabled={!ready} onClick={() => ready && !submitting && state.submit(onSubmit)}>
            {submitting ? m["admins.invite_submitting"]() : m["admins.invite_submit"]()}
          </Button>
        </div>
      </footer>
    </>
  );
}

type FormState = ReturnType<typeof useAdminPermissionForm>;
type CatalogQuery = ReturnType<typeof usePermissionCatalogQuery>;

function InviteBody({
  catalog,
  roles,
  submitting,
  state,
}: {
  catalog: CatalogQuery;
  roles: RoleOption[];
  submitting: boolean;
  state: FormState;
}) {
  return (
    <div className="grid flex-1 grid-cols-[408px_1fr] overflow-hidden">
      <div className="overflow-y-auto border-r border-grey-200 bg-white p-6">
        <p className="pb-5 text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{m["admins.info_title"]()}</p>
        <AdminInfoFields form={state.form} roles={roles} disabled={submitting} onChange={state.patchForm} />
        {state.attempted && !state.complete && (
          <p className="pt-4 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["admins.invite_error_required"]()}</p>
        )}
      </div>
      <div className="overflow-y-auto bg-white p-6">
        <p className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{m["admins.permissions_title"]()}</p>
        <p className="pt-1 pb-2 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["admins.permissions_subtitle"]()}</p>
        {catalog.isPending && <PermissionSkeleton />}
        {catalog.isError && <p className="py-8 text-center text-sm text-status-fail">{m["admins.permissions_error"]()}</p>}
        {catalog.isSuccess && (
          <PermissionTree modules={catalog.data.modules} granted={state.granted} disabled={submitting} onChange={state.setGranted} />
        )}
      </div>
    </div>
  );
}

function PermissionSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4" aria-busy="true">
      {Array.from({length: 6}, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-lg bg-grey-100" />
      ))}
    </div>
  );
}
