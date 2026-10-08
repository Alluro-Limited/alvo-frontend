import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {AdminsContent} from "@/components/admins/admins-content";
import {AdminsHeader} from "@/components/admins/admins-header";
import {AdminsOverlays} from "@/components/admins/admins-overlays";
import {useAdminsFilters} from "@/components/admins/use-admins-filters";
import {useAdminsOverlays} from "@/components/admins/use-admins-overlays";
import {useAdminsQuery} from "@/queries/use-admins-query";

/** System → Admin & Permissions — KPIs, the admin table, and the invite/edit/suspend flows. */
export function AdminsPage() {
  const filters = useAdminsFilters();
  const selection = useParcelSelection();
  const overlays = useAdminsOverlays();
  const list = useAdminsQuery(filters.listParams);

  return (
    <div className="flex flex-col gap-6">
      <AdminsHeader onInvite={overlays.openInvite} />
      <AdminsContent filters={filters} selection={selection} list={list} overlays={overlays} />
      <AdminsOverlays overlays={overlays} data={list.data} />
    </div>
  );
}
