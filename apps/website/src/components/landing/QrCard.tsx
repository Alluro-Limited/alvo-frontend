import {heroContent} from "@/content/landing";

export function QrCard() {
  return (
    <div className="relative h-[108px] w-[338px] shrink-0 overflow-clip rounded-2xl bg-white">
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <p className="text-base font-medium tracking-[0.16px] text-black">{heroContent.qrTitle}</p>
        <p className="text-xs font-normal tracking-[0.12px] text-grey-600">{heroContent.qrSubtitle}</p>
      </div>
      <div className="absolute left-[234px] top-1/2 -translate-y-1/2 rounded-xl bg-[#fffcf7] p-2.5">
        <img alt="" className="size-[60px]" src="/landing/hero/qr.svg" />
      </div>
    </div>
  );
}
