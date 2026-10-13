import {ChevronLeft} from "lucide-react";
import {cn} from "cnfast";
import type {DeliveryDetail} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";

export type DeliveryTab = "overview" | "packages" | "status";

interface DeliveryHeaderProps {
  delivery: DeliveryDetail;
  tab: DeliveryTab;
  onTab: (t: DeliveryTab) => void;
  onBack: () => void;
}

/** Back arrow + job id + kind/date line + the three tab switcher. */
export function DeliveryHeader({delivery, tab, onTab, onBack}: DeliveryHeaderProps) {
  const scanned = delivery.packages.filter((p) => p.scanned).length;
  const tabs: {id: DeliveryTab; label: string}[] = [
    {id: "overview", label: m["job.overview"]()},
    {id: "packages", label: `${m["job.packages"]()} (${scanned}/${delivery.manifestTotal})`},
    {id: "status", label: m["job.status"]()},
  ];

  return (
    <header>
      <button type="button" onClick={onBack} aria-label={m["nav.back"]()} className="-ml-1 flex size-8 items-center justify-center">
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <h1 className="mt-6 text-[24px] leading-[30px] font-bold tracking-[-0.01em]">{delivery.id}</h1>
      <p className="mt-1.5 text-[12px] text-grey-500">
        {delivery.kind === "speed" ? m["jobs.speed"]() : m["jobs.regular"]()}
        {` · ${delivery.dateLabel}`}
      </p>
      <nav className="mt-6 flex border-b border-grey-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => onTab(t.id)}
            className={cn(
              "px-1 pb-2.5 mr-6 text-[14px] font-medium -mb-px border-b-2",
              tab === t.id ? "text-primary-500 border-primary-500" : "text-grey-500 border-transparent"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
