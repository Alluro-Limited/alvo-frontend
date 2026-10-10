import {createFileRoute} from "@tanstack/react-router";
import {NodeDetailPage} from "@/pages/node-detail";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/nodes/$nodeId")({
  head: ({params}) => ({meta: [{title: m["shell.page_meta_title"]({title: params.nodeId})}]}),
  component: NodeDetailRoute,
});

function NodeDetailRoute() {
  const {nodeId} = Route.useParams();
  return <NodeDetailPage nodeId={nodeId} />;
}
