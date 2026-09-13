import {trackingContent} from "@/content/tracking";

import {TrackingTimeline} from "./TrackingTimeline";

export function TrackingSuccess() {
  const {result} = trackingContent;

  return (
    <div className="mx-auto flex w-full max-w-[938px] flex-col overflow-hidden rounded-xl bg-white shadow-sm lg:flex-row">
      <div className="flex w-full flex-col lg:w-[469px]">
        <div className="flex items-center justify-between gap-4 bg-primary-500 p-6 text-white">
          <div className="flex flex-col gap-0.5">
            <p className="font-sans text-xs font-normal tracking-[0.12px]">{result.trackingId}</p>
            <p className="font-sans text-base font-medium tracking-[0.16px]">{result.summary}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white bg-cream px-2.5 py-2 text-xs font-bold tracking-[0.02em] text-primary-500">
            <span className="size-2 rounded-full bg-primary-500" />
            {result.status}
          </div>
        </div>

        <div className="grid w-full grid-cols-3 divide-x divide-grey-200 border-b border-grey-200">
          <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-5 text-center">
            <p className="font-sans text-xs font-normal tracking-[0.12px] text-grey-500">{result.destination.label}</p>
            <p className="font-sans text-base font-medium tracking-[0.16px] text-black">{result.destination.value}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-5 text-center">
            <p className="font-sans text-xs font-normal tracking-[0.12px] text-grey-500">{result.eta.label}</p>
            <p className="font-sans text-base font-medium tracking-[0.16px] text-black">{result.eta.value}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-5 text-center">
            <p className="font-sans text-xs font-normal tracking-[0.12px] text-grey-500">{result.stops.label}</p>
            <p className="font-sans text-base font-medium tracking-[0.16px] text-black">{result.stops.value}</p>
          </div>
        </div>

        <div className="p-8">
          <TrackingTimeline />
        </div>
      </div>

      <div className="relative h-[529px] w-full overflow-hidden lg:w-[469px]">
        <img alt={result.mapAlt} className="absolute inset-0 size-full object-cover" src={result.mapSrc} />
      </div>
    </div>
  );
}
