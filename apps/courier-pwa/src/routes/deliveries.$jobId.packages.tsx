import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {PackageListPage} from "@/pages/package-list";

export const Route = createFileRoute("/deliveries/$jobId/packages")({
  head: () => ({meta: [{title: m["job.package_list"]()}]}),
  component: function PackageListRoute() {
    const {jobId} = Route.useParams();
    return <PackageListPage jobId={jobId} />;
  },
});
