import supportChatUrl from "@/assets/support-chat.png";
import supportEmailUrl from "@/assets/support-email.png";
import supportHeadsetUrl from "@/assets/support-headset.png";
import supportPhoneUrl from "@/assets/support-phone.png";
import supportWhatsappUrl from "@/assets/support-whatsapp.png";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const CHANNELS: {icon: string; title: SimpleMessage; desc: SimpleMessage; href?: string}[] = [
  {icon: supportPhoneUrl, title: "sup.phone", desc: "sup.phone_d"},
  {icon: supportEmailUrl, title: "sup.email", desc: "sup.email_d", href: "mailto:support@alvo.com"},
  {icon: supportWhatsappUrl, title: "sup.whatsapp", desc: "sup.whatsapp_d"},
  {icon: supportChatUrl, title: "sup.chat", desc: "sup.chat_d"},
];

/** The Support tab — the 2×2 grid of contact-channel cards. */
export function SupportPage() {
  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[120px] pt-[60px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["sup.title"]()}</h1>
        <img src={supportHeadsetUrl} alt="" className="size-[52px]" />
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        {CHANNELS.map((channel) => (
          <SupportCard key={channel.title} {...channel} />
        ))}
      </div>
    </main>
  );
}

function SupportCard({icon, title, desc, href}: (typeof CHANNELS)[number]) {
  const body = (
    <>
      <img src={icon} alt="" className="size-8" />
      <div className="flex w-full flex-col gap-1">
        <span className="text-[16px] font-semibold leading-[1.4] tracking-[0.16px] text-foreground">{m[title]()}</span>
        <span className="text-[13px] leading-[1.4] tracking-[0.13px] text-grey-500">{m[desc]()}</span>
      </div>
    </>
  );
  const className = "flex h-[166px] w-full flex-col justify-between rounded-[8px] bg-[#f9f9f9] p-4 text-left";
  return href ? (
    <a href={href} className={className}>
      {body}
    </a>
  ) : (
    <button type="button" className={className}>
      {body}
    </button>
  );
}
