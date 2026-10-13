import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const INCLUDED: SimpleMessage[] = ["del.i1", "del.i2", "del.i3", "del.i4"];

/** The farewell copy, the "This includes:" bullet list, and the cannot-be-undone warning. */
export function DeleteIntro() {
  return (
    <>
      <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["del.desc"]()}</p>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["del.includes"]()}</h2>
        <ul className="flex w-full flex-col gap-2">
          {INCLUDED.map((key) => (
            <li key={key} className="flex items-center gap-3 text-[14px] leading-[1.4] tracking-[0.14px] text-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
              {m[key]()}
            </li>
          ))}
        </ul>
        <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-status-fail">{m["del.warning"]()}</p>
      </div>
    </>
  );
}
