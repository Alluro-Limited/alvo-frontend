import {Search} from "lucide-react";

import {trackingContent} from "@/content/tracking";

type TrackingInputProps = {
  code: string;
  onChange: (value: string) => void;
  onTrack: () => void;
};

export function TrackingInput({code, onChange, onTrack}: TrackingInputProps) {
  return (
    <div className="flex w-full max-w-[608px] flex-col items-start gap-8">
      <div className="flex w-full flex-col items-start gap-4 text-center">
        <h1 className="w-full font-sans text-[40px] font-bold leading-[1.1] tracking-[-0.6px] text-black sm:text-[48px] lg:text-[60px]">
          {trackingContent.heading}
        </h1>
        <p className="w-full font-sans text-base font-medium leading-[1.4] tracking-[0.16px] text-grey-600">{trackingContent.subhead}</p>
      </div>

      <form
        className="flex w-full gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onTrack();
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            type="text"
            value={code}
            onChange={(event) => onChange(event.target.value)}
            placeholder={trackingContent.inputPlaceholder}
            className="h-[50px] w-full rounded-lg border border-grey-300 bg-white px-4 font-sans text-sm font-normal tracking-[0.14px] text-black placeholder:text-grey-500 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-[50px] shrink-0 items-center gap-2 rounded-lg bg-primary-500 px-5 font-sans text-base font-medium tracking-[0.02em] text-white transition-opacity hover:opacity-90"
        >
          <Search className="size-5" />
          {trackingContent.trackCta}
        </button>
      </form>
    </div>
  );
}
