import {Flag} from "lucide-react";
import {m} from "@/paraglide/messages";

interface PublicPoolBannerProps {
  declinedBy: string[];
  onPullBack: () => void;
}

/** The purple "In public pool" strip — who declined plus the pull-back-to-assign action. */
export function PublicPoolBanner({declinedBy, onPullBack}: PublicPoolBannerProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-accent-50 p-3">
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-accent-500">{m["assignment.public_pool_title"]()}</p>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-accent-500">
        {m["assignment.public_pool_declined"]({couriers: declinedBy.join(", ")})}
      </p>
      <button
        type="button"
        onClick={onPullBack}
        className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-accent-500 bg-white px-3 py-2 text-sm leading-[1.4] font-medium tracking-[0.14px] text-accent-500 hover:bg-accent-50"
      >
        <Flag className="size-4" aria-hidden="true" />
        {m["assignment.public_pool_action"]()}
      </button>
    </div>
  );
}
