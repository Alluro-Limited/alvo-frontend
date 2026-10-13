import {createFileRoute} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {LegalDocPage} from "@/pages/legal-doc";

export const Route = createFileRoute("/legal/$doc")({
  head: () => ({meta: [{title: m["legal.meta_title"]()}]}),
  component: function LegalDocRoute() {
    const {doc} = Route.useParams();
    return <LegalDocPage doc={doc} />;
  },
});
