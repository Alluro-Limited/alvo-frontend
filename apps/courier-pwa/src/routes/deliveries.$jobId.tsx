import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {DeliveryPage} from "@/pages/delivery";

export const Route = createFileRoute("/deliveries/$jobId")({
  head: () => ({meta: [{title: m["deliveries.meta_title"]()}]}),
  component: function DeliveryRoute() {
    const {jobId} = Route.useParams();
    return <DeliveryPage jobId={jobId} />;
  },
});
