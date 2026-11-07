import {Button} from "@alvo/ui";
import {Upload, X} from "lucide-react";
import {iosBrowser as browser, useInstallPrompt} from "@/lib/install-prompt";
import {m} from "@/paraglide/messages";

/**
 * Bottom install banner — pops on every visit until the app is installed.
 * Chromium fires the native prompt via the deferred event; iOS Safari gets
 * manual Share → Add to Home Screen instructions instead.
 */
export function InstallPrompt() {
  const {show, canPrompt, ios, install, dismiss} = useInstallPrompt();
  if (!show) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 rounded-[16px] border border-grey-200 bg-white p-4 shadow-lg"
      role="dialog"
      aria-label={m["install_prompt.title"]()}
    >
      <div className="flex items-start gap-3">
        <img src="/pwa-logo.svg" alt="" aria-hidden="true" className="size-10 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[14px] font-medium leading-[1.4]">{m["install_prompt.title"]()}</p>
          {ios ? (
            <p className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-grey-600">
              <Upload className="size-3.5 shrink-0 text-primary-500" aria-hidden="true" />
              {m[`install_prompt.ios_${browser() ?? "other"}`]()}
            </p>
          ) : (
            <p className="text-[12px] leading-[1.4] text-grey-600">{m["install_prompt.body"]()}</p>
          )}
        </div>
        <button type="button" onClick={dismiss} aria-label={m["install_prompt.dismiss"]()} className="shrink-0 text-grey-500">
          <X className="size-4" />
        </button>
      </div>
      {canPrompt && (
        <Button className="mt-3 w-full" onClick={install}>
          {m["install_prompt.cta"]()}
        </Button>
      )}
    </div>
  );
}
