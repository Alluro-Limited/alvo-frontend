import {useState} from "react";
import type {PlatformSettings} from "@/types/settings-types";

/** Unsaved section edits overlay the server payload — patches replace whole sections, cleared on save. */
export function useSettingsDraft(server: PlatformSettings | undefined) {
  const [edits, setEdits] = useState<Partial<PlatformSettings>>({});
  const draft: PlatformSettings | null = server ? {...server, ...edits} : null;
  const patch = (partial: Partial<PlatformSettings>) => setEdits((current) => ({...current, ...partial}));
  const reset = () => setEdits({});
  return {draft, patch, reset};
}
