import {Button} from "@alvo/ui";
import {Flag, Lock, type LucideIcon} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {PayoutIssueItem, PayoutIssuesSummary} from "@/types/payouts-types";
import {formatNairaAmount} from "@/lib/format";

export type IssueCardKind = "withheld" | "flagged";

const KIND_TOKENS: Record<IssueCardKind, {title: () => string; Icon: LucideIcon; chip: string; amount: string}> = {
  withheld: {
    title: m["payout.withheld_title"],
    Icon: Lock,
    chip: "bg-status-fail-subtle text-status-fail-dark",
    amount: "text-status-fail",
  },
  flagged: {
    title: m["payout.flagged_title"],
    Icon: Flag,
    chip: "bg-status-warning-subtle text-status-warning-dark",
    amount: "text-status-warning-dark",
  },
};

interface PayoutIssuesCardProps {
  kind: IssueCardKind;
  summary: PayoutIssuesSummary;
  /** "View all" filters the table to this status; "Review" opens the courier drawer. */
  onViewAll: () => void;
  onReview: (courierId: string) => void;
}

/** The Withheld Payouts / Flagged Payments card — header chip, subtitle, three preview rows. */
export function PayoutIssuesCard({kind, summary, onViewAll, onReview}: PayoutIssuesCardProps) {
  const tokens = KIND_TOKENS[kind];
  return (
    <section className="flex-1 overflow-clip rounded-xl border border-grey-300 bg-white" aria-label={tokens.title()}>
      <header className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className={cn("flex size-10 items-center justify-center rounded-full", tokens.chip)}>
            <tokens.Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{tokens.title()}</p>
            <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
              {m["payout.issues_sub"]({count: summary.unresolvedCount, amount: `₦${formatNairaAmount(summary.heldAmount)}`})}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-500 hover:text-primary-600"
        >
          {m["payout.view_all"]()}
        </button>
      </header>
      {summary.items.length === 0 ? <CardEmpty Icon={tokens.Icon} /> : <IssueRows kind={kind} items={summary.items} onReview={onReview} />}
    </section>
  );
}

/** The centered lock/flag icon + generic-list empty copy the design uses inside both cards. */
function CardEmpty({Icon}: {Icon: LucideIcon}) {
  return (
    <div className="flex min-h-[255px] flex-col items-center justify-center gap-3 border-t border-grey-200 text-center">
      <Icon className="size-12 text-grey-300" aria-hidden="true" strokeWidth={1.25} />
      <div>
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["payout.card_empty_title"]()}</p>
        <p className="mx-auto w-[260px] text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["payout.card_empty_description"]()}</p>
      </div>
    </div>
  );
}

function IssueRows({kind, items, onReview}: {kind: IssueCardKind; items: PayoutIssueItem[]; onReview: (courierId: string) => void}) {
  return (
    <div className="flex flex-col gap-2 border-t border-grey-200 p-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-grey-300 bg-white p-4">
          <div className="min-w-0">
            <p className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{item.courierName}</p>
            <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
              {item.issueCount === 1
                ? m["payout.issue_line_one"]({count: item.issueCount, label: item.issueLabel})
                : m["payout.issue_line"]({count: item.issueCount, label: item.issueLabel})}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <p className={cn("text-sm leading-[1.4] font-bold tracking-[0.14px] whitespace-nowrap", KIND_TOKENS[kind].amount)}>
              <span className="font-normal">₦</span>
              {formatNairaAmount(item.amount)}
            </p>
            <Button
              variant="outline"
              className="h-8 rounded-lg px-3 text-sm font-medium tracking-[0.28px]"
              onClick={() => onReview(item.courierId)}
            >
              {m["payout.review"]()}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
