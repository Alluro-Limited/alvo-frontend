import type {ReactNode} from "react";
import type {LucideIcon} from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

/** A grey-tinted account menu card: icon + group title header, white body holding option rows. */
export function MenuCard({icon: Icon, title, children}: MenuCardProps) {
  return (
    <section className="rounded-[12px] bg-grey-100 p-1 pt-2">
      <div className="flex items-center gap-1 px-3 pb-2">
        <Icon className="size-4 text-grey-500" aria-hidden="true" />
        <h2 className="text-[14px] text-grey-500">{title}</h2>
      </div>
      <div className="rounded-[8px] border border-grey-200 bg-white px-3">{children}</div>
    </section>
  );
}
