import {useEffect, useState} from "react";

/** Chrome/Android's deferred install event — not in the DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: "accepted" | "dismissed"}>;
}

const DISMISS_KEY = "alvo.install-dismissed";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean(navigator.standalone));

/** iOS Safari never fires beforeinstallprompt — it needs manual instructions instead. */
export const isIosSafari = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone();

/**
 * Add-to-home-screen state. The banner pops on every visit until the app is
 * installed; dismissing only silences it for the current session, so the next
 * open prompts again. `appinstalled` and display-mode changes hide it for good.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());
  const [dismissed, setDismissed] = useState(() => typeof sessionStorage !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === "1");

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    const mq = window.matchMedia("(display-mode: standalone)");
    const onMode = () => setInstalled(isStandalone());
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    mq.addEventListener("change", onMode);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      mq.removeEventListener("change", onMode);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const {outcome} = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return {
    show: !installed && !dismissed && (deferred !== null || isIosSafari()),
    canPrompt: deferred !== null,
    ios: isIosSafari(),
    install,
    dismiss,
  };
}
