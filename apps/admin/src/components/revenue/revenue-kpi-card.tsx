/** The ₦ symbol drops to 18px regular next to the 24px bold figure — same rule on every money card. */
function MoneyValue({amount}: {amount: string}) {
  return (
    <p className="flex items-baseline gap-px text-primary-800">
      <span className="text-lg leading-[1.4] tracking-[0.18px]">₦</span>
      <span className="text-2xl leading-[1.2] font-bold tracking-[-0.24px]">{amount}</span>
    </p>
  );
}

interface RevenueKpiCardProps {
  title: string;
  /** Rendered figure — pass a pre-formatted string or a compact-naira amount. */
  value: string;
  /** Show the value as a ₦ money figure; counts render as plain bold digits. */
  money?: boolean;
  sub: string;
  /** 16px glyph inside the grey circle — the exported Figma asset. */
  icon: string;
}

/** One KPI card — title + grey icon chip over the big figure and its caption. */
export function RevenueKpiCard({title, value, money = true, sub, icon}: RevenueKpiCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-grey-300 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{title}</p>
          <div className="flex flex-col gap-1.5">
            {money ? (
              <MoneyValue amount={value} />
            ) : (
              <p className="text-2xl leading-[1.2] font-bold tracking-[-0.24px] text-primary-800">{value}</p>
            )}
            <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{sub}</p>
          </div>
        </div>
        <span className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-grey-50">
          <img src={icon} alt="" className="size-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
