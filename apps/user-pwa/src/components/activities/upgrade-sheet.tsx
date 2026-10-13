import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Globe, Wallet} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {GatewaySheet} from "@/components/safe/gateway-sheet";
import {useDeliveryQuery, useUpgradeLocker} from "@/queries/use-activity-queries";
import type {LockerUpgrade} from "@/types/activity-types";
import type {PaymentChannel} from "@/types/send-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

interface UpgradeSheetProps {
  deliveryId: string;
  onClose: () => void;
  /** Opens the cancel-shipment confirmation dialog. */
  onCancel: () => void;
}

/** "Locker Size Upgrade Required" sheet — size diff + fee, payment channel, pay, success. */
export function UpgradeSheet({deliveryId, onClose, onCancel}: UpgradeSheetProps) {
  const [channel, setChannel] = useState<PaymentChannel | null>(null);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [done, setDone] = useState(false);
  const detail = useDeliveryQuery(deliveryId);
  const upgrade = useUpgradeLocker(deliveryId);

  const pay = () => {
    if (!channel) return;
    if (channel === "online") setGatewayOpen(true);
    upgrade.mutate(channel, {onSuccess: () => setDone(true)});
  };

  return (
    <>
      <AuthSheet open onClose={onClose}>
        {done ? (
          <UpgradeSuccess deliveryId={deliveryId} onClose={onClose} />
        ) : upgrade.isPending && channel === "wallet" ? (
          <UpgradeLoading />
        ) : (
          <UpgradeForm
            upgrade={detail.data?.lockerUpgrade ?? null}
            channel={channel}
            onChannel={setChannel}
            onPay={pay}
            onCancel={onCancel}
          />
        )}
      </AuthSheet>
      <GatewaySheet open={gatewayOpen} onClose={() => setGatewayOpen(false)} />
    </>
  );
}

function UpgradeLoading() {
  return (
    <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
      ))}
    </div>
  );
}

interface UpgradeFormProps {
  upgrade: LockerUpgrade | null;
  channel: PaymentChannel | null;
  onChannel: (c: PaymentChannel) => void;
  onPay: () => void;
  onCancel: () => void;
}

function UpgradeForm({upgrade, channel, onChannel, onPay, onCancel}: UpgradeFormProps) {
  if (!upgrade) return <UpgradeLoading />;
  return (
    <div className="mt-2 flex w-full flex-col gap-6 pb-4">
      <div className="flex w-full flex-col gap-2 text-center">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["upg.title"]()}</h2>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["upg.desc"]()}</p>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-[12px] bg-[#f9f9f9] p-4">
        <SizeRow label={m["upg.current"]()} value={upgrade.currentSize} />
        <SizeRow label={m["upg.new"]()} value={upgrade.newSize} />
        <SizeRow label={m["upg.fee"]()} value={naira(upgrade.fee)} fee />
      </div>
      <div className="flex w-full flex-col gap-4">
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-[#070d17]">{m["upg.channel"]()}</p>
        <div className="flex w-full items-center gap-8" role="radiogroup" aria-label={m["upg.channel"]()}>
          <ChannelRadio
            selected={channel === "wallet"}
            icon={<Wallet className="size-5" aria-hidden="true" />}
            label={m["send.wallet"]()}
            onPick={() => onChannel("wallet")}
          />
          <ChannelRadio
            selected={channel === "online"}
            icon={<Globe className="size-5" aria-hidden="true" />}
            label={m["send.online"]()}
            onPick={() => onChannel("online")}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button className="w-full text-[16px] font-medium" variant={channel ? "default" : "disabled"} onClick={onPay}>
          {m["upg.pay"]()}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-status-fail"
        >
          {m["upg.cancel"]()}
        </button>
      </div>
    </div>
  );
}

function SizeRow({label, value, fee}: {label: string; value: string; fee?: boolean}) {
  return (
    <span className="flex w-full items-center justify-between text-[14px] leading-[1.4] tracking-[0.14px]">
      <span className="text-grey-500">{label}</span>
      <span className={fee ? "font-medium text-foreground" : "font-medium text-primary-600"}>{value}</span>
    </span>
  );
}

function ChannelRadio({selected, icon, label, onPick}: {selected: boolean; icon: React.ReactNode; label: string; onPick: () => void}) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onPick} className="flex items-center gap-2.5 text-left">
      <span className="flex size-8 items-center justify-center rounded-[8px] bg-primary-50 text-primary-600">{icon}</span>
      <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-[#070d17]">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[22px] items-center justify-center rounded-full border",
          selected ? "border-primary-500" : "border-grey-300 bg-white"
        )}
      >
        {selected ? <span className="size-2.5 rounded-full bg-primary-500" /> : null}
      </span>
    </button>
  );
}

function UpgradeSuccess({deliveryId, onClose}: {deliveryId: string; onClose: () => void}) {
  const navigate = useNavigate();
  const go = (to: "/home" | "/delivery/$id") => {
    onClose();
    if (to === "/home") void navigate({to: "/home"});
    else void navigate({to: "/delivery/$id", params: {id: deliveryId}});
  };
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-6 pb-4 pt-10">
      <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-16" />
      <div className="flex w-full flex-col gap-2 text-center">
        <h2 className="text-[24px] font-bold leading-[1.2] text-foreground">{m["upg.success_title"]()}</h2>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["upg.success_desc"]()}</p>
      </div>
      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={() => go("/home")}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
        >
          {m["upg.home"]()}
        </button>
        <Button className="flex-1 text-[16px] font-medium" onClick={() => go("/delivery/$id")}>
          {m["upg.details"]()}
        </Button>
      </div>
    </div>
  );
}
