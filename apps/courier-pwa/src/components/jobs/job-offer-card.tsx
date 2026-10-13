import type {JobOffer} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";
import {OfferMeta} from "./offer-meta";

interface JobOfferCardProps {
  offer: JobOffer;
  pending: boolean;
  onDecline: () => void;
  onAccept: () => void;
}

/** One marketplace offer: id + kind, route with locker codes, payout, meta rows, Decline/Accept. */
export function JobOfferCard({offer, pending, onDecline, onAccept}: JobOfferCardProps) {
  const speed = offer.kind === "speed";

  return (
    <article className="rounded-[14px] border border-grey-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-grey-500">{offer.id}</p>
        <p className={speed ? "text-[12px] font-semibold text-[#d99a2b]" : "text-[12px] font-semibold text-primary-500"}>
          {speed ? m["jobs.speed"]() : m["jobs.regular"]()}
        </p>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-[15px] font-bold tracking-[-0.01em]">
          {offer.origin}
          <span className="text-[11px] font-medium text-primary-500">{`(${offer.originCode})`}</span>
          <span className="mx-1.5 font-normal text-grey-400">→</span>
          {offer.destination}
          <span className="text-[11px] font-medium text-primary-500">{`(${offer.destinationCode})`}</span>
        </p>
        <p className="text-[15px] font-bold">₦{offer.payout.toLocaleString("en-US")}</p>
      </div>
      <OfferMeta offer={offer} />
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onDecline}
          disabled={pending}
          className="h-[38px] flex-1 rounded-[10px] bg-danger-50 text-[14px] font-semibold text-danger-600 disabled:opacity-60"
        >
          {m["home.decline"]()}
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={pending}
          className="h-[38px] flex-1 rounded-[10px] bg-primary-500 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {m["home.accept"]()}
        </button>
      </div>
    </article>
  );
}
