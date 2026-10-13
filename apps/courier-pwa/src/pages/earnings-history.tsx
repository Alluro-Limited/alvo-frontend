import {useNavigate} from "@tanstack/react-router";
import {EarningRow} from "@/components/earnings/earning-row";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {useEarningsHistoryQuery} from "@/queries/use-earnings-queries";
import type {TransactionGroup} from "@/types/earnings-types";

/** The full feed behind "See all" — day-grouped rows with Yesterday/date dividers. */
export function EarningsHistoryPage() {
  const navigate = useNavigate();
  const query = useEarningsHistoryQuery();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/earnings"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["earnings.history_title"]()}</h1>
      {query.isPending || !query.data ? (
        <div className="mt-6 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[8px] bg-grey-100" />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {query.data.map((group, index) => (
            <HistoryGroup key={group.dayLabel ?? "first"} group={group} isFirst={index === 0} />
          ))}
        </div>
      )}
    </main>
  );
}

function HistoryGroup({group, isFirst}: {group: TransactionGroup; isFirst: boolean}) {
  return (
    <section className={isFirst ? "" : "mt-2"}>
      {group.dayLabel && (
        <p className="mb-2 flex items-center gap-2 text-[11px] text-grey-500">
          <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
          {group.dayLabel}
          <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
        </p>
      )}
      {group.items.map((txn) => (
        <EarningRow key={txn.id} txn={txn} />
      ))}
    </section>
  );
}
