import {Lock, Mail, ArrowUpFromLine} from "lucide-react";

import {trackingContent} from "@/content/tracking";

type IconKey = "lock" | "send" | "mail";

const icons: Record<IconKey, typeof Lock> = {
  lock: Lock,
  send: ArrowUpFromLine,
  mail: Mail,
};

export function TrackingActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {trackingContent.quickActions.map((action) => {
        const Icon = icons[action.icon as IconKey];
        return (
          <a
            key={action.label}
            href={action.href}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-cream px-5 text-base font-medium tracking-[0.02em] text-primary-800 transition-colors hover:bg-grey-100"
          >
            <Icon className="size-5" />
            {action.label}
          </a>
        );
      })}
    </div>
  );
}
