import {X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const ITEMS: {q: SimpleMessage; a: SimpleMessage; link?: boolean}[] = [
  {q: "faq.q1", a: "faq.a1a", link: true},
  {q: "faq.q2", a: "faq.a2"},
  {q: "faq.q3", a: "faq.a3"},
  {q: "faq.q4", a: "faq.a4"},
];

/** The FAQs sheet — numbered question/answer entries opened from the Account tab. */
export function FaqSheet({open, onClose}: {open: boolean; onClose: () => void}) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex h-[80dvh] w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["faq.title"]()}</h2>
          <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-6 overflow-y-auto pb-4">
          {ITEMS.map((item, i) => (
            <div key={item.q} className="flex w-full flex-col gap-2">
              <h3 className="text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-foreground">
                {i + 1}. {m[item.q]()}
              </h3>
              <p className="text-[14px] leading-[1.5] tracking-[0.14px] text-grey-500">
                {m[item.a]()}
                {item.link ? (
                  <>
                    {" "}
                    <button type="button" className="font-medium text-primary-500">
                      {m["faq.tutorial"]()}
                    </button>{" "}
                    {m["faq.a1b"]()}
                  </>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AuthSheet>
  );
}
