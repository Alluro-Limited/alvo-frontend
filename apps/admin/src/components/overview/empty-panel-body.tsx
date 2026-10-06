import type {ReactNode} from "react";

interface EmptyPanelBodyProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/** Centered icon + title + description shown when a rail card has nothing to list. */
export function EmptyPanelBody({icon, title, description}: EmptyPanelBodyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      {icon}
      <div className="flex flex-col">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{description}</p>
      </div>
    </div>
  );
}
