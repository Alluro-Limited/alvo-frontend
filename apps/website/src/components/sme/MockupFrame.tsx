import {type ReactNode} from "react";

export function MockupFrame({tabs, activeTab, children}: {tabs: readonly string[]; activeTab: string; children: ReactNode}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[28px] bg-grey-100">
      <div className="flex items-center gap-4 border-b border-black/[0.06] bg-white/[0.6] px-4 py-3.5 sm:px-5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-grey-300" />
          <span className="size-2.5 rounded-full bg-grey-300" />
          <span className="size-2.5 rounded-full bg-grey-300" />
        </div>

        <div className="flex gap-1">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium tracking-[0.01em] ${
                tab === activeTab ? "bg-primary-50 text-primary-500" : "text-grey-600"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
