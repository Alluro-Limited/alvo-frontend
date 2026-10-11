import type {ReactNode} from "react";

interface SettingsCardProps {
  title: string;
  subtitle: string;
  /** Optional footer row (Cancel / Save actions); the notifications card omits it. */
  footer?: ReactNode;
  children: ReactNode;
}

/** The shared settings card: header copy, content area, and an optional action footer. */
export function SettingsCard({title, subtitle, footer, children}: SettingsCardProps) {
  return (
    <section className="flex w-full max-w-[635px] flex-col overflow-clip rounded-xl border border-grey-300 bg-white">
      <div className="flex flex-col gap-8 p-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-lg leading-[1.2] font-medium text-[#070d17]">{title}</h2>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-[#070d17] opacity-50">{subtitle}</p>
        </header>
        {children}
      </div>
      {footer && <div className="flex items-center justify-between border-t border-grey-300 px-6 pt-4 pb-6">{footer}</div>}
    </section>
  );
}
