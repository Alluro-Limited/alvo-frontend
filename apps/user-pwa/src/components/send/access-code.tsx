import {ChevronLeft} from "lucide-react";
import {m} from "@/paraglide/messages";
import qrCodeUrl from "@/assets/qr-code.svg";
import qrLogoUrl from "@/assets/qr-logo.svg";

interface AccessCodeScreenProps {
  /** e.g. "B-1247" — spelled out with spaces on screen. */
  code: string;
  /** e.g. "Dec 22, 11:34 AM" */
  validUntil: string;
  /** e.g. "7 hours 59 mins remaining" */
  remaining: string;
  onBack: () => void;
}

/** "Scan/Enter code" — the drop-off QR plus the spelled-out access code and its validity countdown. */
export function AccessCodeScreen({code, validUntil, remaining, onBack}: AccessCodeScreenProps) {
  const spelled = code.split("").join(" ");
  return (
    <main className="flex h-dvh w-full flex-col bg-white px-6 pt-[65px]">
      <button type="button" onClick={onBack} aria-label={m["auth.back"]()} className="flex size-8 items-center justify-center">
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <div className="mt-8 flex w-full flex-col gap-8">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{m["send.code_title"]()}</h1>
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.code_desc"]()}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex size-[240px] items-center justify-center overflow-clip rounded-[14.4px] border-[1.2px] border-grey-200 bg-grey-100">
              <div className="relative size-[240px] overflow-clip bg-white">
                <img src={qrCodeUrl} alt={m["send.qr_alt"]()} className="absolute inset-[6.9%] size-[86.2%]" />
                <img
                  src={qrLogoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[38.4px] w-[31px] -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
              <span className="text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">{m["send.or"]()}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.access_code"]()}</span>
              <span className="text-[42px] font-bold leading-[1.1] tracking-[-0.42px] text-foreground whitespace-nowrap">{spelled}</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
            <span className="font-medium text-status-fail-dark">{m["send.valid_until"]({time: validUntil})}</span>
            <span className="text-status-fail">{remaining}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
