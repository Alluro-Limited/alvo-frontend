import {useNavigate} from "@tanstack/react-router";
import {Building2, CircleX, Copy} from "lucide-react";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {LoadingDots} from "@/components/loading-dots";
import {useGenerateVirtualAccount} from "@/queries/use-account-queries";
import type {VirtualAccount} from "@/types/account-types";
import {m} from "@/paraglide/messages";

interface GenerateAccountSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Generate Virtual Account — intro → creating → ready (account card) or the failure view. */
export function GenerateAccountSheet({open, onClose}: GenerateAccountSheetProps) {
  const generate = useGenerateVirtualAccount();

  const view = generate.isPending ? "loading" : generate.isSuccess ? "success" : generate.isError ? "error" : "intro";

  return (
    <AuthSheet open={open} onClose={onClose}>
      {view === "loading" ? (
        <div className="flex h-[40dvh] w-full flex-col items-center justify-center gap-4">
          <LoadingDots />
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["wal.gen_loading"]()}</p>
        </div>
      ) : view === "success" && generate.data ? (
        <SuccessView account={generate.data} onDone={onClose} />
      ) : view === "error" ? (
        <ErrorView onRetry={() => generate.mutate()} onClose={onClose} />
      ) : (
        <IntroView onGenerate={() => generate.mutate()} />
      )}
    </AuthSheet>
  );
}

function IntroView({onGenerate}: {onGenerate: () => void}) {
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-6 pb-4 pt-6 text-center">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-[#e9fafb]">
        <Building2 className="size-6 text-primary-500" aria-hidden="true" />
      </span>
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-[20px] font-bold leading-[1.2] text-foreground">{m["wal.gen_title"]()}</h2>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["wal.gen_desc"]()}</p>
      </div>
      <Button className="w-full text-[16px] font-medium" onClick={onGenerate}>
        {m["wal.gen_cta"]()}
      </Button>
    </div>
  );
}

function SuccessView({account, onDone}: {account: VirtualAccount; onDone: () => void}) {
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-6 pb-4 pt-6 text-center">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-[#e9fafb]">
        <Building2 className="size-6 text-primary-500" aria-hidden="true" />
      </span>
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-[20px] font-bold leading-[1.2] text-foreground">{m["wal.gen_done_title"]()}</h2>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["wal.gen_done_desc"]()}</p>
      </div>
      <div className="flex w-full flex-col gap-3 rounded-[16px] bg-[#f9f9f9] p-4 text-left">
        <Field label={m["wal.bank_name"]()} value={account.bankName} />
        <div className="flex items-end justify-between">
          <Field label={m["wal.acct_number"]()} value={account.number} />
          <button
            type="button"
            aria-label={m["send.copy"]()}
            onClick={() => void navigator.clipboard?.writeText(account.number).catch(() => undefined)}
            className="pb-1 text-primary-500"
          >
            <Copy className="size-5" aria-hidden="true" />
          </button>
        </div>
        <Field label={m["wal.acct_name"]()} value={account.accountName} />
      </div>
      <Button className="w-full text-[16px] font-medium" onClick={onDone}>
        {m["wal.done"]()}
      </Button>
    </div>
  );
}

function Field({label, value}: {label: string; value: string}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{label}</span>
      <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{value}</span>
    </div>
  );
}

function ErrorView({onRetry, onClose}: {onRetry: () => void; onClose: () => void}) {
  const navigate = useNavigate();
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-6 pb-4 pt-6 text-center">
      <CircleX className="size-[52px] text-status-fail" aria-hidden="true" />
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-[20px] font-bold leading-[1.2] text-foreground">{m["wal.gen_fail"]()}</h2>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["wal.gen_fail_desc"]()}</p>
      </div>
      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            void navigate({to: "/support"});
          }}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
        >
          {m["wal.contact"]()}
        </button>
        <Button className="h-[50px] flex-1 text-[16px] font-medium" onClick={onRetry}>
          {m["wal.retry"]()}
        </Button>
      </div>
    </div>
  );
}
