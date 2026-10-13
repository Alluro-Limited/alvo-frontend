import {Link} from "@tanstack/react-router";
import {ChevronRight} from "lucide-react";
import {m} from "@/paraglide/messages";
import {LEGAL_DOCS, type LegalDocId} from "./legal-docs";

interface LegalLinkProps {
  doc: LegalDocId;
}

/** One Legal & Support menu row — 18px icon + label + chevron into `/legal/$doc`. */
export function LegalLink({doc}: LegalLinkProps) {
  const {icon: Icon, menuLabel} = LEGAL_DOCS[doc];
  return (
    <Link to="/legal/$doc" params={{doc}} className="flex items-center gap-3 px-2 py-4">
      <span className="flex flex-1 items-center gap-3 text-[14px] font-medium">
        <Icon className="size-[18px]" aria-hidden="true" />
        {m[menuLabel]()}
      </span>
      <ChevronRight className="size-6 text-grey-500" aria-hidden="true" />
    </Link>
  );
}
