import {m} from "@/paraglide/messages";

/** The legal line under the personal-details form; the pages don't exist yet so links hit the catch-all. */
export function TermsNotice() {
  return (
    <p className="mx-auto max-w-[318px] text-center text-xs leading-[1.4] font-medium tracking-[0.01em] text-foreground/50">
      {m["sign_up.terms_prefix"]()}
      <a href="/terms" className="text-primary-500 underline">
        {m["sign_up.terms_of_service"]()}
      </a>
      {m["sign_up.terms_and"]()}
      <a href="/privacy" className="text-primary-500 underline">
        {m["sign_up.privacy_policy"]()}
      </a>
      {"."}
    </p>
  );
}
