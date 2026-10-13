import {Switch} from "@alvo/ui";
import {AuthField} from "@/components/auth/auth-field";
import {SizePicker} from "./size-picker";
import type {PackageSize} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface PackageStepProps {
  size: PackageSize | null;
  contents: string;
  fragile: boolean;
  onSize: (size: PackageSize) => void;
  onContents: (value: string) => void;
  onFragile: (value: boolean) => void;
}

/** Step 2 — package size radio cards, optional contents, and the fragile-handling switch. */
export function PackageStep({size, contents, fragile, onSize, onContents, onFragile}: PackageStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <SizePicker value={size} onChange={onSize} />
      <div className="flex w-full flex-col gap-2">
        <AuthField
          id="send-contents"
          label={m["send.contents_label"]()}
          value={contents}
          onChange={onContents}
          placeholder={m["send.contents_ph"]()}
        />
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["send.contents_help"]()}</p>
      </div>
      <div className="flex w-full items-center gap-2">
        <Switch checked={fragile} onCheckedChange={onFragile} aria-label={m["send.fragile"]()} />
        <div className="flex flex-1 flex-col">
          <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["send.fragile"]()}</span>
          <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["send.fragile_desc"]()}</span>
        </div>
      </div>
    </div>
  );
}
