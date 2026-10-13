import type {DeliveryDetail} from "@/types/activity-types";
import iconCheckUrl from "@/assets/icon-check.svg";

/** The terminal-state header for collected/cancelled deliveries — status icon + message + timestamp. */
export function CollectedCard({delivery}: {delivery: DeliveryDetail}) {
  return (
    <div className="flex w-full flex-col items-center gap-2 pt-6">
      <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-16" />
      <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{delivery.statusMessage}</p>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{delivery.updatedAt}</p>
    </div>
  );
}
