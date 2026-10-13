import {CircleCheck} from "lucide-react";

/** The floating confirmation pill ("Address added" / "Address deleted") near the bottom of the page. */
export function AddressToast({message}: {message: string}) {
  return (
    <div role="status" className="absolute inset-x-0 bottom-[140px] flex justify-center">
      <span className="flex items-center gap-2 rounded-[12px] bg-white px-4 py-3 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
        <CircleCheck className="size-5 text-primary-500" aria-hidden="true" />
        {message}
      </span>
    </div>
  );
}
