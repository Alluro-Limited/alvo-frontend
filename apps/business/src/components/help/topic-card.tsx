import type {LucideIcon} from "lucide-react";
import {ArrowRight} from "lucide-react";
import {m} from "@/paraglide/messages";

export interface HelpTopic {
  id: string;
  Icon: LucideIcon;
  title: () => string;
  description: () => string;
}

/** One "What do you need help with?" card — icon chip, topic copy, and a browse link. */
export function TopicCard({topic}: {topic: HelpTopic}) {
  return (
    <article className="flex flex-1 flex-col gap-3 rounded-xl border border-grey-200 bg-white p-4">
      <div className="flex size-7 items-center rounded bg-[#e8fafc] p-1">
        <topic.Icon className="size-5 text-primary-600" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{topic.title()}</h3>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600 opacity-70">{topic.description()}</p>
        </div>
        <a href="#still-need-help" className="flex w-fit items-center text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-500">
          {m["help.browse_articles"]()}
          <ArrowRight className="ml-0.5 size-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
