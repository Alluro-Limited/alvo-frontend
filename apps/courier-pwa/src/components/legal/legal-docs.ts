import {ClipboardList, HeartHandshake, Lock, Scale, type LucideIcon} from "lucide-react";
import type {SimpleMessage} from "@/lib/i18n";

export type LegalDocId = "terms" | "privacy" | "conduct" | "liability";

interface LegalDoc {
  icon: LucideIcon;
  /** Menu-row label on the Legal & Support screen. */
  menuLabel: SimpleMessage;
  /** Title on the document screen. */
  title: SimpleMessage;
  body: SimpleMessage;
}

/** The four legal documents — ids double as the `/legal/$doc` route params. */
export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  terms: {icon: ClipboardList, menuLabel: "legal.terms", title: "legald.terms", body: "legald.terms_body"},
  privacy: {icon: Lock, menuLabel: "legal.privacy", title: "legald.privacy", body: "legald.privacy_body"},
  conduct: {icon: HeartHandshake, menuLabel: "legal.conduct", title: "legald.conduct", body: "legald.conduct_body"},
  liability: {icon: Scale, menuLabel: "legal.liability", title: "legald.liability", body: "legald.liability_body"},
};
