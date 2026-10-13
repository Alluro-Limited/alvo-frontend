import {useState} from "react";
import {X} from "lucide-react";
import {Button} from "@alvo/ui";
import {AuthField} from "@/components/auth/auth-field";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {UpdatedView} from "./updated-view";
import {useUpdateName} from "@/queries/use-account-queries";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const NAME_CHARS = /^[A-Za-zÀ-ÿ' -]+$/;

interface UpdateNameSheetProps {
  open: boolean;
  firstName: string;
  lastName: string;
  onClose: () => void;
}

interface NameErrors {
  first?: SimpleMessage;
  last?: SimpleMessage;
}

/** "Update Name" sheet — current-name card, first/last fields with validation, then a success view. */
export function UpdateNameSheet({open, firstName, lastName, onClose}: UpdateNameSheetProps) {
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [errors, setErrors] = useState<NameErrors>({});
  const [saved, setSaved] = useState(false);
  const update = useUpdateName();

  const close = () => {
    setFirst(firstName);
    setLast(lastName);
    setErrors({});
    setSaved(false);
    onClose();
  };

  const submit = () => {
    const next: NameErrors = {};
    if (!first.trim()) next.first = "pi.first_empty";
    else if (!NAME_CHARS.test(first)) next.first = "pi.first_invalid";
    if (!last.trim()) next.last = "pi.last_empty";
    else if (!NAME_CHARS.test(last)) next.last = "pi.last_invalid";
    setErrors(next);
    if (next.first || next.last) return;
    update.mutate({firstName: first.trim(), lastName: last.trim()}, {onSuccess: () => setSaved(true)});
  };

  return (
    <AuthSheet open={open} onClose={close}>
      {update.isPending ? (
        <LoadingDots />
      ) : saved ? (
        <UpdatedView title={m["pi.name_done"]()} description={m["pi.name_done_desc"]()} value={`${last} ${first}`} onDone={close} />
      ) : (
        <NameForm
          first={first}
          last={last}
          errors={errors}
          current={`${lastName} ${firstName}`}
          onFirst={setFirst}
          onLast={setLast}
          onCancel={close}
          onSubmit={submit}
        />
      )}
    </AuthSheet>
  );
}

function LoadingDots() {
  return (
    <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
      ))}
    </div>
  );
}

interface NameFormProps {
  first: string;
  last: string;
  errors: NameErrors;
  current: string;
  onFirst: (v: string) => void;
  onLast: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function NameForm({first, last, errors, current, onFirst, onLast, onCancel, onSubmit}: NameFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["pi.name_title"]()}</h2>
        <button type="button" onClick={onCancel} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 flex w-full flex-col gap-1.5 rounded-[12px] bg-[#f9f9f9] p-4">
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["pi.current_name"]()}</span>
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{current}</span>
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <Field id="pi-first" label={m["pi.first"]()} value={first} onChange={onFirst} error={errors.first} />
        <Field id="pi-last" label={m["pi.last"]()} value={last} onChange={onLast} error={errors.last} />
      </div>
      <div className="mt-6 flex w-full gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#00221e]"
        >
          {m["pi.cancel"]()}
        </button>
        <Button className="flex-1 text-[14px] font-medium" onClick={onSubmit}>
          {m["pi.save"]()}
        </Button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: SimpleMessage;
}) {
  return (
    <div className="flex flex-col gap-1">
      <AuthField id={id} label={label} value={value} onChange={onChange} error={!!error} autoComplete="off" />
      {error ? <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail">{m[error]()}</span> : null}
    </div>
  );
}
