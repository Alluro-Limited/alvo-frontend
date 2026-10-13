import {Copy, Download, LoaderPinwheel, Share2} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {copyText, saveQr, shareCode} from "./access-utils";
import {AccessCodeBlock} from "./code-block";
import type {AccessCode, DeliveryDetail, PickupLocation} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import qrCodeUrl from "@/assets/qr-code.svg";
import qrLogoUrl from "@/assets/qr-logo.svg";

interface PickupBodyProps {
  delivery: DeliveryDetail;
  onReactivate: () => void;
  /** Opens the OTP sheet — safe pickup only. */
  onVerify: () => void;
}

/** The Pickup Access tab — not-ready empty state, the safe verification flow, or the package code + location. */
export function PickupBody({delivery, onReactivate, onVerify}: PickupBodyProps) {
  if (!delivery.pickupAccess) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
        <LoaderPinwheel className="size-12 text-grey-400" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[18px] font-medium leading-[1.3] text-foreground">{m["acc.not_ready"]()}</h2>
          <p className="max-w-[300px] text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["acc.not_ready_desc"]()}</p>
        </div>
      </div>
    );
  }
  if (delivery.kind === "safe") return <SafePickupBody access={delivery.pickupAccess} onVerify={onVerify} />;
  return (
    <>
      <AccessCodeBlock access={delivery.pickupAccess} pickup onReactivate={onReactivate} />
      <LocationBlock location={delivery.pickupLocation} />
      <SaveShare code={delivery.pickupAccess.code} />
    </>
  );
}

/** Safe pickup — the code stays masked until "Retrieve Now" passes the OTP check, then it's a one-time 10-min code. */
function SafePickupBody({access, onVerify}: {access: AccessCode; onVerify: () => void}) {
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
      </div>
      <div className="flex w-full items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
        <span className="text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">{m["send.or"]()}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-grey-300" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.access_code"]()}</span>
        <SafeCodeValue access={access} />
      </div>
      {access.protected ? (
        <Button className="rounded-full px-8 text-[14px] font-medium" onClick={onVerify}>
          {m["acc.retrieve"]()}
        </Button>
      ) : (
        <SafeValidity access={access} />
      )}
    </div>
  );
}

function SafeCodeValue({access}: {access: AccessCode}) {
  if (access.protected || access.expired) {
    return (
      <span className="flex items-center gap-3 py-4" aria-label={access.code}>
        {access.code.split("").map((ch, i) => (
          <span key={`${ch}-${i}`} aria-hidden="true" className="size-4 rounded-full bg-foreground" />
        ))}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-3">
      <span className="whitespace-nowrap text-[42px] font-bold leading-[1.1] tracking-[-0.42px] text-foreground">
        {access.code.split("").join(" ")}
      </span>
      <button type="button" onClick={() => copyText(access.code)} aria-label={m["send.copy"]()} className="text-primary-500">
        <Copy className="size-6" aria-hidden="true" />
      </button>
    </span>
  );
}

function SafeValidity({access}: {access: AccessCode}) {
  if (access.expired) {
    return (
      <div className="flex flex-col items-center text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
        <span className="font-medium text-status-fail-dark">{m["acc.expired_at"]({time: access.validUntil})}</span>
        <span className="text-status-fail">{m["acc.reactivate_note"]()}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
      <span className="font-medium text-status-fail-dark">{m["acc.valid_for"]({time: access.validUntil})}</span>
      <span className="text-status-fail">{m["acc.one_time"]()}</span>
    </div>
  );
}

function LocationBlock({location}: {location: PickupLocation}) {
  const rows: {label: SimpleMessage; value: string}[] = [
    {label: "acc.node", value: location.node},
    {label: "acc.locker", value: location.locker},
    {label: "acc.directions", value: location.directions},
  ];
  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <h3 className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["acc.location"]()}</h3>
      {rows.map((row) => (
        <div key={row.label} className="flex w-full items-start justify-between gap-4">
          <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m[row.label]()}</span>
          <span className="max-w-[220px] text-right text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SaveShare({code}: {code: string}) {
  const actions: {label: SimpleMessage; Icon: typeof Download; onClick: () => void}[] = [
    {label: "acc.save", Icon: Download, onClick: saveQr},
    {label: "acc.share", Icon: Share2, onClick: () => shareCode(code)},
  ];
  return (
    <div className="mt-8 flex w-full items-center justify-center gap-16">
      {actions.map(({label, Icon, onClick}) => (
        <button key={label} type="button" onClick={onClick} className="flex flex-col items-center gap-1 text-primary-500">
          <Icon className="size-6" aria-hidden="true" />
          <span className="text-[12px] font-medium leading-[1.4] tracking-[0.12px]">{m[label]()}</span>
        </button>
      ))}
    </div>
  );
}
