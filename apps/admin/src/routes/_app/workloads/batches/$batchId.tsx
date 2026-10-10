import {createFileRoute} from "@tanstack/react-router";
import {BatchDetailPage} from "@/pages/batch-detail";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/workloads/batches/$batchId")({
  head: ({params}) => ({meta: [{title: m["shell.page_meta_title"]({title: params.batchId})}]}),
  component: BatchDetailRoute,
});

function BatchDetailRoute() {
  const {batchId} = Route.useParams();
  return <BatchDetailPage batchId={batchId} />;
}
