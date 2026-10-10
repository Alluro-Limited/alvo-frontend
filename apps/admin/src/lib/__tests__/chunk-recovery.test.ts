import {afterEach, describe, expect, it, vi} from "vite-plus/test";
import {RELOAD_COOLDOWN_MS, startChunkRecovery} from "../chunk-recovery";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => void values.delete(key),
    setItem: (key, value) => void values.set(key, value),
  };
}

function firePreloadError() {
  const event = new Event("vite:preloadError", {cancelable: true});
  window.dispatchEvent(event);
  return event;
}

describe("startChunkRecovery", () => {
  let stop: (() => void) | undefined;

  afterEach(() => stop?.());

  it("reloads once and prevents the error from surfacing", () => {
    const reload = vi.fn();
    stop = startChunkRecovery({reload, storage: memoryStorage(), now: () => 1_000});

    const event = firePreloadError();

    expect(reload).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not reload again within the cooldown", () => {
    const reload = vi.fn();
    let time = 1_000;
    stop = startChunkRecovery({reload, storage: memoryStorage(), now: () => time});

    firePreloadError();
    time += RELOAD_COOLDOWN_MS - 1;
    const second = firePreloadError();

    expect(reload).toHaveBeenCalledOnce();
    expect(second.defaultPrevented).toBe(false);
  });

  it("reloads again once the cooldown has passed", () => {
    const reload = vi.fn();
    let time = 1_000;
    stop = startChunkRecovery({reload, storage: memoryStorage(), now: () => time});

    firePreloadError();
    time += RELOAD_COOLDOWN_MS;
    firePreloadError();

    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does not reload when storage is unusable", () => {
    const reload = vi.fn();
    const storage = memoryStorage();
    storage.getItem = () => {
      throw new Error("blocked");
    };
    stop = startChunkRecovery({reload, storage, now: () => 1_000});

    firePreloadError();

    expect(reload).not.toHaveBeenCalled();
  });

  it("stops listening when unsubscribed", () => {
    const reload = vi.fn();
    startChunkRecovery({reload, storage: memoryStorage(), now: () => 1_000})();

    firePreloadError();

    expect(reload).not.toHaveBeenCalled();
  });
});
