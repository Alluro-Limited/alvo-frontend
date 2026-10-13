import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {DeleteForm} from "@/components/account/delete-form";
import {DeleteIntro} from "@/components/account/delete-intro";
import {DeleteOtpSheet} from "@/components/account/delete-otp-sheet";
import {PageHeader} from "@/components/account/page-header";
import {useRequestAccountDeletion} from "@/queries/use-account-queries";
import {HTTPError} from "ky";
import {m} from "@/paraglide/messages";

function wrongPassword(err: Error) {
  return err instanceof HTTPError && (err.data as {code?: string} | undefined)?.code === "invalid_password";
}

/** Delete account — the consent + password gate before the emailed/sms'd confirmation code. */
export function DeleteAccountPage() {
  const navigate = useNavigate();
  const request = useRequestAccountDeletion();
  const [password, setPassword] = useState("");
  const [consents, setConsents] = useState([false, false]);
  const [otpOpen, setOtpOpen] = useState(false);

  const ready = password.length > 0 && consents.every(Boolean) && !request.isPending;

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["del.title"]()} />
      <DeleteIntro />
      <DeleteForm
        password={password}
        badPassword={request.isError && wrongPassword(request.error)}
        consents={consents}
        pending={request.isPending}
        ready={ready}
        onPassword={(v) => {
          setPassword(v);
          request.reset();
        }}
        onConsent={(i, checked) => setConsents((prev) => prev.map((v, j) => (j === i ? checked : v)))}
        onSubmit={() => request.mutate(password, {onSuccess: () => setOtpOpen(true)})}
      />
      <DeleteOtpSheet open={otpOpen} onClose={() => setOtpOpen(false)} onDeleted={() => void navigate({to: "/sign-in"})} />
    </main>
  );
}
