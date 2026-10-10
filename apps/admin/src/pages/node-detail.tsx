import {useState} from "react";
import {AppToast} from "@/components/app-toast";
import {ChangeNodeStatusDialog} from "@/components/nodes/change-node-status-dialog";
import {NODE_STATUS_LABELS} from "@/components/nodes/node-status-labels";
import {NodeCompartments} from "@/components/nodes/node-compartments";
import {NodeContents} from "@/components/nodes/node-contents";
import {NodeDetailError} from "@/components/nodes/node-detail-error";
import {NodeDetailHeader} from "@/components/nodes/node-detail-header";
import {NodeDetailSkeleton} from "@/components/nodes/node-detail-skeleton";
import {NodeMaintenance} from "@/components/nodes/node-maintenance";
import {NodeSensors} from "@/components/nodes/node-sensors";
import {NodeStatCards} from "@/components/nodes/node-stat-cards";
import {NodeSummaryCard} from "@/components/nodes/node-summary-card";
import {m} from "@/paraglide/messages";
import {useChangeNodeStatusMutation} from "@/queries/use-change-node-status-mutation";
import {useNodeQuery} from "@/queries/use-node-query";
import type {ChangeNodeStatusInput, NodeDetail, NodeStatus} from "@/types/nodes-types";

function DetailBody({node, now}: {node: NodeDetail; now: number}) {
  return (
    <div className="flex flex-col gap-4">
      <NodeSummaryCard node={node} />
      <NodeStatCards node={node} now={now} />
      <div className="grid grid-cols-2 items-start gap-4">
        <div className="flex flex-col gap-4">
          <NodeCompartments groups={node.compartments} />
          <NodeSensors sensors={node.sensors} />
        </div>
        <div className="flex flex-col gap-4">
          <NodeContents items={node.contents} now={now} />
          <NodeMaintenance events={node.maintenance} />
        </div>
      </div>
    </div>
  );
}

/** The node detail page — summary, stats, capacity, sensors, contents, maintenance, and status changes. */
export function NodeDetailPage({nodeId}: {nodeId: string}) {
  const {data, isPending, isError, refetch, isRefetching} = useNodeQuery(nodeId);
  const [dialog, setDialog] = useState<{initial?: NodeStatus} | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [now] = useState(() => Date.now());
  const changeStatus = useChangeNodeStatusMutation(nodeId);

  const submit = (input: ChangeNodeStatusInput) =>
    changeStatus.mutate(input, {
      onSuccess: () => {
        setDialog(null);
        setToast(m["nodes.status_changed_toast"]({id: nodeId, status: NODE_STATUS_LABELS[input.status]()}));
      },
    });

  const closeDialog = () => {
    setDialog(null);
    changeStatus.reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <NodeDetailHeader
        name={data?.name}
        onScheduleMaintenance={() => setDialog({initial: "maintenance"})}
        onChangeStatus={() => setDialog({})}
      />
      {isPending ? (
        <NodeDetailSkeleton />
      ) : isError || !data ? (
        <NodeDetailError onRetry={() => void refetch()} isRetrying={isRefetching} />
      ) : (
        <DetailBody node={data} now={now} />
      )}
      {dialog && data && (
        <ChangeNodeStatusDialog
          node={data}
          initialStatus={dialog.initial}
          submitting={changeStatus.isPending}
          failed={changeStatus.isError}
          onClose={closeDialog}
          onSubmit={submit}
        />
      )}
      {toast && <AppToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
