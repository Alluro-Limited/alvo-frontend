import {Copy} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {copyText} from "./access-utils";
import type {AccessCode} from "@/types/activity-types";
import {m} from "@/paraglide/messages";
import qrCodeUrl from "@/assets/qr-code.svg";
import qrLogoUrl from "@/assets/qr-logo.svg";

/** The QR tile + "or" divider + spelled-out code + validity lines shared by the drop-off and package pickup tabs. */
export function AccessCodeBlock({access, pickup, onReactivate}: {access: AccessCode; pickup?: boolean; onReactivate?: () => void}) {
  const spelled = access.code.split("").join(" ");
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-6">
      <div className="relative flex size-[240px] items-center justify-center overflow-clip rounded-[14.4px] border-[1.2px] border-grey-200 bg-grey-100">
        <div className="relative size-[240px] overflow-clip bg-white">
          <img src={qrCodeUrl} alt={m["send.qr_alt"]()} className={cn("absolute inset-[6.9%] size-[86.2%]", access.expired && "blur-sm")} />
          {!access.expired ? (
            <img
              src={qrLogoUrl}
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[38.4px] w-[31px] -translate-x-1/2 -translate-y-1/2"
            />
          ) : null}
        </div>
        {access.expired && pickup ? (
          <Button
            className="absolute left-1/2 top-1/2 h-10 -translate-x-1/2 -translate-y-1/2 rounded-[8px] px-4 text-[14px]"
            onClick={onReactivate}
          >
            {m["acc.reactivate"]()}
          </Button>
        ) : null}
      </div>
      <CodeLines access={access} pickup={pickup} spelled={spelled} />
    </div>
  );
}

function CodeLines({access, pickup, spelled}: {access: AccessCode; pickup?: boolean; spelled: string}) {
  return (
    <>
      <div className="flex w-full items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
        <span className="text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">{m["send.or"]()}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.access_code"]()}</span>
        {access.expired ? (
          <span className="flex items-center gap-3 py-4" aria-label={access.code}>
            {access.code.split("").map((ch, i) => (
              <span key={`${ch}-${i}`} aria-hidden="true" className="size-4 rounded-full bg-foreground" />
            ))}
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <span className="whitespace-nowrap text-[42px] font-bold leading-[1.1] tracking-[-0.42px] text-foreground">{spelled}</span>
            {pickup ? (
              <button type="button" onClick={() => copyText(access.code)} aria-label={m["send.copy"]()} className="text-primary-500">
                <Copy className="size-6" aria-hidden="true" />
              </button>
            ) : null}
          </span>
        )}
      </div>
      <ValidityLines access={access} pickup={pickup} />
    </>
  );
}

function ValidityLines({access, pickup}: {access: AccessCode; pickup?: boolean}) {
  if (access.expired) {
    return (
      <div className="flex flex-col items-center text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
        <span className="font-medium text-status-fail-dark">{m["acc.expired_at"]({time: access.validUntil})}</span>
        <span className="text-status-fail">{pickup ? m["acc.reactivate_note"]() : m["acc.expired_note"]()}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
      <span className="font-medium text-status-fail-dark">{m["send.valid_until"]({time: access.validUntil})}</span>
      <span className="text-status-fail">{access.remaining}</span>
    </div>
  );
}
