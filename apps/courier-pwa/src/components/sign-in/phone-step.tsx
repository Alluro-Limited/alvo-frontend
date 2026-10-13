import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {PhoneField} from "@/components/form/phone-field";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

interface PhoneStepProps {
  phone: string;
  error: SimpleMessage | null;
  pending: boolean;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
}

/** Step 1: phone number entry that kicks off the SMS code request. */
export function PhoneStep({phone, error, pending, onPhoneChange, onSubmit}: PhoneStepProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-[30px] leading-[36px] font-bold tracking-[-0.01em]">{m["auth.welcome"]()}</h1>
      <p className="mt-3 text-[16px] leading-[22px] text-grey-500">{m["auth.welcome_desc"]()}</p>
      <div className="mt-8">
        <PhoneField phone={phone} errors={{phone: error ?? undefined}} onChange={onPhoneChange} />
      </div>
      <Button className="mt-8 h-[50px] w-full text-[16px]" isLoading={pending} onClick={onSubmit}>
        {pending ? m["auth.sending"]() : m["auth.continue"]()}
      </Button>
      <p className="mt-12 text-center text-[14px] leading-[20px] text-grey-500">
        {m["auth.new_driver"]()}{" "}
        <Link to="/sign-up" className="font-semibold text-primary-500">
          {m["auth.create_account"]()}
        </Link>
      </p>
    </div>
  );
}
