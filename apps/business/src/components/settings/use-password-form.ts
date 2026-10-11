import {useState, type FormEvent} from "react";
import {HTTPError} from "ky";
import {m} from "@/paraglide/messages";
import {useChangePasswordMutation} from "@/queries/use-settings-queries";
import type {PasswordErrors, PasswordValues} from "./password-fields";

const MIN_PASSWORD = 8;
const UNAUTHORIZED = 401;
const EMPTY: PasswordValues = {current: "", next: "", confirm: ""};

type Banner = "wrong" | "failed" | "success" | null;

function validate(values: PasswordValues): PasswordErrors {
  const errors: PasswordErrors = {};
  if (!values.current) errors.current = m["settings.errors.required"]();
  if (values.next.length < MIN_PASSWORD) errors.next = m["settings.errors.password_short"]();
  if (values.confirm !== values.next) errors.confirm = m["settings.errors.password_mismatch"]();
  return errors;
}

/** State machine for the change-password card: field state, validation, submit, reset. */
export function usePasswordForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [banner, setBanner] = useState<Banner>(null);
  const mutation = useChangePasswordMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setBanner(null);
    mutation.mutate(
      {currentPassword: values.current, newPassword: values.next},
      {
        onSuccess: () => {
          setValues(EMPTY);
          setBanner("success");
        },
        onError: (error) => setBanner(error instanceof HTTPError && error.response.status === UNAUTHORIZED ? "wrong" : "failed"),
      }
    );
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setBanner(null);
  };

  return {values, errors, banner, submit, reset, isSaving: mutation.isPending, setValues};
}
