import {createFileRoute} from "@tanstack/react-router";
import {BatchDetailPage} from "@/pages/batch-detail";
import {m} from "@/paraglide/messages";

export const Route = createFileRoute("/_app/shipments/$batchId")({
  head: () => ({meta: [{title: m["shell.page_meta_title"]({title: m["batches.title"]()})}]}),
  component: function BatchDetailRoute() {
    const {batchId} = Route.useParams();
    return <BatchDetailPage batchId={batchId} />;
  },
});
