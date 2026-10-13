import {Checkbox} from "@alvo/ui";
import {AuthField} from "@/components/auth/auth-field";
import {PhoneField} from "@/components/auth/phone-field";
import type {RecipientDetails} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface RecipientStepProps {
  recipient: RecipientDetails;
  onChange: (patch: Partial<RecipientDetails>) => void;
}

export function isRecipientValid(recipient: RecipientDetails): boolean {
  return recipient.name.trim().length > 0 && recipient.phone.length >= 10;
}

/** Step 4 — recipient name, phone, optional email/note, and save-to-contacts. */
export function RecipientStep({recipient, onChange}: RecipientStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <AuthField
        id="send-rc-name"
        label={m["send.rc_name"]()}
        value={recipient.name}
        onChange={(name) => onChange({name})}
        placeholder={m["send.rc_name_ph"]()}
        autoComplete="off"
      />
      <PhoneField id="send-rc-phone" label={m["send.rc_phone"]()} value={recipient.phone} onChange={(phone) => onChange({phone})} />
      <AuthField
        id="send-rc-email"
        label={m["send.rc_email"]()}
        type="email"
        value={recipient.email}
        onChange={(email) => onChange({email})}
        placeholder={m["send.rc_email_ph"]()}
        autoComplete="off"
      />
      <AuthField
        id="send-rc-note"
        label={m["send.rc_note"]()}
        value={recipient.note}
        onChange={(note) => onChange({note})}
        placeholder={m["send.rc_note_ph"]()}
      />
      <div className="flex w-full items-center gap-2">
        <Checkbox
          checked={recipient.saveToContacts}
          onCheckedChange={(checked) => onChange({saveToContacts: checked === true})}
          aria-label={m["send.save_contact"]()}
        />
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-primary-850">{m["send.save_contact"]()}</span>
      </div>
    </div>
  );
}
