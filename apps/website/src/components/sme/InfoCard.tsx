import {Check} from "lucide-react";

export function InfoCard({heading, body, bullets}: {heading: string; body: string; bullets: readonly string[]}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h3 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-black sm:text-[32px]">{heading}</h3>
        <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600">{body}</p>
      </div>

      <ul className="flex flex-col gap-4 rounded-xl bg-grey-100 p-4 sm:p-5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className="text-sm leading-[1.4] tracking-[0.01em] text-grey-600">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
