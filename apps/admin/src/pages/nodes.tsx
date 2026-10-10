import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {AppToast} from "@/components/app-toast";
import {NodesError} from "@/components/nodes/nodes-error";
import {NodesHeader} from "@/components/nodes/nodes-header";
import {NodesList} from "@/components/nodes/nodes-list";
import {NodesSkeleton} from "@/components/nodes/nodes-skeleton";
import type {NodesView} from "@/components/nodes/nodes-view-tabs";
import {RegisterNodeDialog} from "@/components/nodes/register-node-dialog";
import {useNodesFilters} from "@/components/nodes/use-nodes-filters";
import {useRegisterFlow} from "@/components/nodes/use-register-flow";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {useNodesQuery} from "@/queries/use-nodes-query";
import type {NodeListResponse} from "@/types/nodes-types";

interface ListHandlers {
  view: NodesView;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onRegister: () => void;
}

interface PageContentProps extends ListHandlers {
  pending: boolean;
  failed: boolean;
  retrying: boolean;
  data?: NodeListResponse;
  onRetry: () => void;
}

function PageContent({pending, failed, retrying, data, onRetry, ...handlers}: PageContentProps) {
  if (pending) return <NodesSkeleton />;
  if (failed || !data) return <NodesError onRetry={onRetry} isRetrying={retrying} />;
  return <NodesList data={data} {...handlers} />;
}

/** The Nodes console — metrics, filters, list/map views, registration wizard, and the detail hand-off. */
export function NodesPage() {
  const [view, setView] = useState<NodesView>("list");
  const {filters, params, onQuery, onStatus, onPage, clearFilters} = useNodesFilters();
  const {selected, toggleRow, toggleAll} = useParcelSelection();
  const flow = useRegisterFlow();
  const navigate = useNavigate();
  const {data, isPending, isError, refetch, isRefetching} = useNodesQuery(params);

  const handlers: ListHandlers = {
    view,
    selected,
    filters,
    onQuery,
    onStatus,
    onToggleRow: toggleRow,
    onToggleAll: toggleAll,
    onOpen: (id) => void navigate({to: "/nodes/$nodeId", params: {nodeId: id}}),
    onPage,
    onClearFilters: clearFilters,
    onRegister: flow.openWizard,
  };

  return (
    <div className="flex flex-col gap-4">
      <NodesHeader view={view} refreshing={isRefetching} onView={setView} onRefresh={() => void refetch()} onRegister={flow.openWizard} />
      <PageContent pending={isPending} failed={isError} retrying={isRefetching} data={data} onRetry={() => void refetch()} {...handlers} />
      {flow.open && <RegisterNodeDialog submitting={flow.submitting} failed={flow.failed} onClose={flow.close} onSubmit={flow.submit} />}
      {flow.toast && <AppToast message={flow.toast} onDismiss={flow.dismissToast} />}
    </div>
  );
}
