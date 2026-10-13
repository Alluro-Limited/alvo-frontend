import {Navigate, useNavigate} from "@tanstack/react-router";
import {LEGAL_DOCS, type LegalDocId} from "@/components/legal/legal-docs";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";

interface LegalDocPageProps {
  doc: string;
}

function isLegalDoc(doc: string): doc is LegalDocId {
  return doc in LEGAL_DOCS;
}

/** One legal document — title + justified body copy, per `/legal/$doc`. */
export function LegalDocPage({doc}: LegalDocPageProps) {
  const navigate = useNavigate();
  if (!isLegalDoc(doc)) return <Navigate to="/legal" />;
  const content = LEGAL_DOCS[doc];

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/legal"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m[content.title]()}</h1>
      <p className="mt-6 text-justify text-[14px] leading-[1.4] tracking-[0.14px] whitespace-pre-wrap text-black/50">{m[content.body]()}</p>
    </main>
  );
}
