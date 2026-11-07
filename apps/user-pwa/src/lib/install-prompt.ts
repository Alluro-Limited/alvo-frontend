import {useEffect, useState} from "react";

/** Chrome/Android's deferred install event — not in the DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: "accepted" | "dismissed"}>;
}

const DISMISS_KEY = "alvo.install-dismissed";

/**
 * Capture beforeinstallprompt the moment this module loads — Chrome can fire it
 * before React mounts effects, so listening inside useEffect misses it.
 */
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn());
  });
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean(navigator.standalone));

export type IosBrowser = "safari" | "chrome" | "firefox" | "edge" | "other";

/** Which iOS browser is showing the page — each has a different manual install path. */
export function iosBrowser(): IosBrowser | null {
  if (typeof navigator === "undefined" || !/iphone|ipad|ipod/i.test(navigator.userAgent) || isStandalone()) return null;
  const ua = navigator.userAgent;
  if (/CriOS/i.test(ua)) return "chrome";
  if (/FxiOS/i.test(ua)) return "firefox";
  if (/EdgiOS/i.test(ua)) return "edge";
  return /Safari/i.test(ua) ? "safari" : "other";
}

/** iOS never fires beforeinstallprompt — it needs manual instructions instead. */
export const isIosSafari = () => iosBrowser() !== null;

/**
 * Add-to-home-screen state. The banner pops on every visit until the app is
 * installed; dismissing only silences it for the current session, so the next
 * open prompts again. `appinstalled` and display-mode changes hide it for good.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(deferredPrompt);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());
  const [dismissed, setDismissed] = useState(() => typeof sessionStorage !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === "1");

  useEffect(() => {
    const sync = () => setDeferred(deferredPrompt);
    listeners.add(sync);
    const onInstalled = () => setInstalled(true);
    const mq = window.matchMedia("(display-mode: standalone)");
    const onMode = () => setInstalled(isStandalone());
    window.addEventListener("appinstalled", onInstalled);
    mq.addEventListener("change", onMode);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("appinstalled", onInstalled);
      mq.removeEventListener("change", onMode);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const {outcome} = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
    } catch {
      // The event is single-use; a consumed/invalid prompt just re-arms on the
      // next beforeinstallprompt firing.
    } finally {
      setDeferred(null);
      deferredPrompt = null;
    }
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
