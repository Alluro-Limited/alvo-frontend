/**
 * Recovers a tab whose build was replaced underneath it.
 *
 * Code is split into hashed chunks that exist only on the version that built
 * them. When a rollout rolls back (or forward) while a tab is open, the next
 * lazy import asks for a chunk the now-serving version does not have. Vite
 * reports that as `vite:preloadError`; reloading fetches the serving version's
 * HTML and chunks, which is what the user needed.
 *
 * TanStack Router already reloads for route components (`lazyRouteComponent`).
 * This covers every other lazy import, such as `React.lazy` components, which
 * would otherwise hit an error boundary.
 *
 * One reload per cooldown, remembered in sessionStorage across the reload: a
 * chunk missing on every version would otherwise reload forever.
 */

export const RELOAD_COOLDOWN_MS = 10_000;

const LAST_RELOAD_KEY = "chunk-recovery:last-reload";

type ChunkRecoveryOptions = {
  reload?: () => void;
  storage?: Storage;
  now?: () => number;
};

/** Whether a reload may happen now, recording it if so; false when storage is unusable. */
function claimReload(storage: Storage, now: number): boolean {
  try {
    const last = storage.getItem(LAST_RELOAD_KEY);
    if (last !== null && now - Number(last) < RELOAD_COOLDOWN_MS) return false;
    storage.setItem(LAST_RELOAD_KEY, String(now));
    return true;
  } catch {
    return false;
  }
}

/**
 * Reloads the page when a chunk fails to load, at most once per cooldown.
 *
 * @returns the unsubscribe handle
 */
export function startChunkRecovery({
  reload = () => window.location.reload(),
  storage = window.sessionStorage,
  now = Date.now,
}: ChunkRecoveryOptions = {}): () => void {
  const onPreloadError = (event: Event) => {
    if (!claimReload(storage, now())) return;
    // The page is going away; don't let the failed import surface as an error first.
    event.preventDefault();
    reload();
  };

  window.addEventListener("vite:preloadError", onPreloadError);
  return () => window.removeEventListener("vite:preloadError", onPreloadError);
}
