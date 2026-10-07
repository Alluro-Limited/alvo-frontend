import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import type {SmeDetail, SmeUpdateInput} from "@/types/smes-types";

const INPUT =
  "mt-2 h-10 w-full rounded-lg border-[0.75px] border-grey-300 bg-white px-4 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500";
const LABEL = "block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";

type EditTab = "business" | "contact";

const EDIT_TABS: {id: EditTab; label: () => string}[] = [
  {id: "business", label: m["smes.edit_tab_business"]},
  {id: "contact", label: m["smes.edit_tab_contact"]},
];

interface EditSmeModalProps {
  detail: SmeDetail | null;
  /** Backend-supplied Business Type options from the list payload. */
  businessTypes: string[];
  submitting: boolean;
  /** The last save attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: SmeUpdateInput) => void;
}

/** Two-tab edit modal (Business Info / Contact Info) prefilled from the loaded detail. */
export function EditSmeModal({detail, businessTypes, submitting, failed, onClose, onSubmit}: EditSmeModalProps) {
  return (
    <Dialog open={detail !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[520px] max-w-[calc(100vw-32px)] p-6">
          {detail !== null && (
            <EditForm
              key={detail.id}
              detail={detail}
              businessTypes={businessTypes}
              submitting={submitting}
              failed={failed}
              onClose={onClose}
              onSubmit={onSubmit}
            />
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

interface EditFormProps extends Omit<EditSmeModalProps, "detail"> {
  detail: SmeDetail;
}

function EditForm({detail, businessTypes, submitting, failed, onClose, onSubmit}: EditFormProps) {
  const [tab, setTab] = useState<EditTab>("business");
  const [form, setForm] = useState<SmeUpdateInput>({
    businessName: detail.businessName,
    businessType: detail.businessType,
    businessPhone: detail.businessPhone,
    businessEmail: detail.businessEmail,
    location: detail.location,
    contactName: detail.contactName,
    contactEmail: detail.contactEmail,
    contactPhone: detail.contactPhone,
  });
  const set = (key: keyof SmeUpdateInput) => (value: string) => setForm((prev) => ({...prev, [key]: value}));

  return (
    <>
      <EditHeader />
      <EditTabBar tab={tab} onTab={setTab} />
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!submitting) onSubmit(form);
        }}
      >
        {tab === "business" ? (
          <BusinessFields form={form} businessTypes={businessTypes} set={set} />
        ) : (
          <ContactFields form={form} set={set} />
        )}
        {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["smes.edit_error"]()}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            {m["smes.edit_discard"]()}
          </Button>
          <Button type="submit" isLoading={submitting}>
            {submitting ? m["smes.edit_saving"]() : m["smes.edit_save"]()}
          </Button>
        </div>
      </form>
    </>
  );
}

function EditHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["smes.edit_title"]()}</DialogTitle>
        <DialogDescription className="pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
          {m["smes.edit_description"]()}
        </DialogDescription>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

function EditTabBar({tab, onTab}: {tab: EditTab; onTab: (tab: EditTab) => void}) {
  return (
    <div className="mt-5 flex gap-6 border-b border-grey-200" role="tablist">
      {EDIT_TABS.map(({id, label}) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onTab(id)}
          className={cn(
            "border-b-2 pb-2 text-sm leading-[1.4] tracking-[0.14px] transition-colors",
            tab === id ? "border-primary-500 font-medium text-primary-600" : "border-transparent text-grey-500 hover:text-grey-700"
          )}
        >
          {label()}
        </button>
      ))}
    </div>
  );
}

interface FieldsProps {
  form: SmeUpdateInput;
  set: (key: keyof SmeUpdateInput) => (value: string) => void;
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className={LABEL} htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} className={INPUT} />
    </div>
  );
}

function BusinessFields({form, businessTypes, set}: FieldsProps & {businessTypes: string[]}) {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <TextField id="sme-edit-name" label={m["smes.edit_business_name"]()} value={form.businessName ?? ""} onChange={set("businessName")} />
      <div>
        <label className={LABEL} htmlFor="sme-edit-type">
          {m["smes.edit_business_type"]()}
        </label>
        <SelectShell id="sme-edit-type" value={form.businessType ?? ""} onChange={set("businessType")} wrapperClassName="mt-2">
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectShell>
      </div>
      <TextField
        id="sme-edit-phone"
        label={m["smes.edit_business_phone"]()}
        value={form.businessPhone ?? ""}
        onChange={set("businessPhone")}
        type="tel"
      />
      <TextField
        id="sme-edit-email"
        label={m["smes.edit_business_email"]()}
        value={form.businessEmail ?? ""}
        onChange={set("businessEmail")}
        type="email"
      />
      <TextField id="sme-edit-location" label={m["smes.edit_location"]()} value={form.location ?? ""} onChange={set("location")} />
    </div>
  );
}

function ContactFields({form, set}: FieldsProps) {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <TextField
        id="sme-edit-contact-name"
        label={m["smes.edit_contact_name"]()}
        value={form.contactName ?? ""}
        onChange={set("contactName")}
      />
      <TextField
        id="sme-edit-contact-email"
        label={m["smes.edit_contact_email"]()}
        value={form.contactEmail ?? ""}
        onChange={set("contactEmail")}
        type="email"
      />
      <TextField
        id="sme-edit-contact-phone"
        label={m["smes.edit_contact_phone"]()}
        value={form.contactPhone ?? ""}
        onChange={set("contactPhone")}
        type="tel"
      />
    </div>
  );
}
