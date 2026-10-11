import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import emptyParcelsUrl from "@/assets/empty-parcels.svg";

/** The blank-slate under Recent shipments: parcel illustration, pitch, and the two CTAs. */
export function EmptyShipments() {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-10">
      <div className="flex w-full flex-col items-center gap-4">
        <img src={emptyParcelsUrl} alt="" aria-hidden="true" className="size-[72px]" />
        <div className="flex w-[294px] flex-col items-start text-center">
          <p className="w-full text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["dashboard.empty_title"]()}</p>
          <p className="w-full text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["dashboard.empty_description"]()}</p>
        </div>
      </div>
      <div className="flex w-[346px] items-start justify-center gap-2">
        <Button
          render={<Link to="/new-shipment" />}
          nativeButton={false}
          className="h-[38px] flex-1 gap-2 px-3 py-2 text-base tracking-[0.32px]"
        >
          {m["dashboard.empty_send"]()}
        </Button>
        <button
          type="button"
          className="flex h-[38px] items-center justify-center rounded-lg px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] whitespace-nowrap text-primary-500 underline"
        >
          {m["dashboard.empty_template"]()}
        </button>
      </div>
    </div>
  );
}
