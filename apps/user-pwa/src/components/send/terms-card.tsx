import {m} from "@/paraglide/messages";

const PROHIBITED: {bold: "send.p1_b" | "send.p2_b" | "send.p3_b"; rest: "send.p1_r" | "send.p2_r" | "send.p3_r"}[] = [
  {bold: "send.p1_b", rest: "send.p1_r"},
  {bold: "send.p2_b", rest: "send.p2_r"},
  {bold: "send.p3_b", rest: "send.p3_r"},
];

/** The grey guidelines card inside the Storage & Pickup Terms dialog. */
export function TermsCard() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[8px] bg-[#f9f9f9] p-2 tracking-[0.12px]">
      <TermsBlock title={m["send.prohibited"]()} items={PROHIBITED} />
      <TermsBlock
        title={m["send.timing"]()}
        items={[
          {bold: "send.t1_b", rest: "send.t1_r"},
          {bold: "send.t2_b", rest: "send.t2_r"},
        ]}
      />
    </div>
  );
}

function TermsBlock({
  title,
  items,
}: {
  title: string;
  items: readonly {
    bold: "send.p1_b" | "send.p2_b" | "send.p3_b" | "send.t1_b" | "send.t2_b";
    rest: "send.p1_r" | "send.p2_r" | "send.p3_r" | "send.t1_r" | "send.t2_r";
  }[];
}) {
  return (
    <div className="flex w-full flex-col">
      <p className="w-full text-[12px] font-bold leading-[1.4]">{title}</p>
      <ul className="w-full list-disc text-[12px] leading-[1.4] opacity-60">
        {items.map((item) => (
          <li key={item.bold} className="ms-4">
            <span className="font-bold opacity-100">{m[item.bold]()}</span>
            {m[item.rest]()}
          </li>
        ))}
      </ul>
    </div>
  );
}
