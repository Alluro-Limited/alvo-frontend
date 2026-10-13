import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {BankSubmitted} from "@/components/bank/bank-submitted";
import {CurrentAccountCard} from "@/components/bank/current-account-card";
import {RegisteredAccountSheet} from "@/components/bank/registered-account-sheet";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import {TextInput} from "@/components/form/text-input";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {useBankAccountQuery, useBankChangeMutation, useBanksQuery} from "@/queries/use-earnings-queries";
import type {BankAccount} from "@/types/earnings-types";

/** Update Bank Account — the Account "Financials" row target. Form → warning sheet → submitted. */
export function BankAccountPage() {
  const navigate = useNavigate();
  const bankAccount = useBankAccountQuery();
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/profile"})} />
      {submitted ? (
        <BankSubmitted />
      ) : (
        <>
          <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["bank.title"]()}</h1>
          {bankAccount.isPending || !bankAccount.data ? (
            <div className="mt-6 h-[400px] animate-pulse rounded-[12px] bg-grey-100" />
          ) : (
            <BankForm onSubmitted={() => setSubmitted(true)} />
          )}
        </>
      )}
    </main>
  );
}

const EMPTY: BankAccount = {bankName: "", accountNumber: "", accountName: ""};

function BankForm({onSubmitted}: {onSubmitted: () => void}) {
  const bankAccount = useBankAccountQuery();
  const banks = useBanksQuery();
  const change = useBankChangeMutation();
  const [draft, setDraft] = useState<BankAccount>(EMPTY);
  const [confirming, setConfirming] = useState(false);

  const valid = draft.bankName !== "" && /^\d{10}$/.test(draft.accountNumber) && draft.accountName.trim() !== "";

  const confirm = () =>
    change.mutate(draft, {
      onSuccess: () => {
        setConfirming(false);
        onSubmitted();
      },
    });

  return (
    <div className="mt-6 flex flex-1 flex-col gap-6">
      {bankAccount.data && <CurrentAccountCard account={bankAccount.data} />}
      <BankFields draft={draft} banks={banks.data ?? []} onChange={setDraft} />
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={!valid}
        className="mt-auto h-[50px] w-full rounded-[8px] bg-primary-500 text-[16px] font-medium text-white disabled:bg-grey-400 disabled:text-grey-200"
      >
        {m["bank.request"]()}
      </button>
      <RegisteredAccountSheet
        account={draft}
        open={confirming}
        pending={change.isPending}
        onConfirm={confirm}
        onClose={() => setConfirming(false)}
      />
    </div>
  );
}

function BankFields({draft, banks, onChange}: {draft: BankAccount; banks: string[]; onChange: (d: BankAccount) => void}) {
  return (
    <div className="flex flex-col gap-6">
      <FormField label={m["bank.name"]()}>
        {(control) => (
          <SelectInput {...control} value={draft.bankName} onChange={(e) => onChange({...draft, bankName: e.target.value})}>
            <option value="" disabled>
              {m["bank.select"]()}
            </option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </SelectInput>
        )}
      </FormField>
      <FormField label={m["bank.number"]()}>
        {(control) => (
          <TextInput
            {...control}
            inputMode="numeric"
            placeholder={m["bank.number_ph"]()}
            value={draft.accountNumber}
            onChange={(e) => onChange({...draft, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10)})}
          />
        )}
      </FormField>
      <FormField label={m["bank.account_name"]()}>
        {(control) => (
          <TextInput
            {...control}
            placeholder={m["bank.name_ph"]()}
            value={draft.accountName}
            onChange={(e) => onChange({...draft, accountName: e.target.value})}
          />
        )}
      </FormField>
    </div>
  );
}
