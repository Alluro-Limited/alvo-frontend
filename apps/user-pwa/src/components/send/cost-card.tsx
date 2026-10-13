import type {CostLine} from "@/types/send-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

interface CostCardProps {
  title: string;
  desc?: string;
  quote: {lines: CostLine[]; total: number} | null;
  loading: boolean;
}

/** The grey "Item / Price" breakdown card — used as "Estimated cost" and "Delivery cost summary". */
export function CostCard({title, desc, quote, loading}: CostCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] bg-[#f9f9f9] p-3">
      <div className="flex w-full flex-col gap-1">
        <p className="text-[20px] font-bold leading-[1.2] text-foreground">{title}</p>
        {desc ? <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{desc}</p> : null}
      </div>
      {loading || !quote ? (
        <div className="flex flex-col gap-3" aria-hidden="true">
          <div className="h-4 w-full animate-pulse rounded bg-grey-200" />
          <div className="h-4 w-full animate-pulse rounded bg-grey-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-grey-200" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-3 border-b-[0.5px] border-[#e5e5e5] pb-2 text-[14px] leading-[1.4] tracking-[0.14px]">
            <div className="flex w-full items-center justify-between text-grey-500">
              <span>{m["send.item"]()}</span>
              <span>{m["send.price"]()}</span>
            </div>
            {quote.lines.map((line) => (
              <div key={line.id} className="flex w-full items-center justify-between">
                <span className="text-grey-600">{line.label}</span>
                <span className="font-medium text-foreground">{naira(line.amount)}</span>
              </div>
            ))}
          </div>
          <div className="flex w-full items-center justify-between text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-foreground">
            <span>{m["send.total"]()}</span>
            <span>{naira(quote.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
