import {CircleUserRound, Package, Wallet} from "lucide-react";
import helpHeroUrl from "@/assets/help-hero.png";
import {useSetPageTitle} from "@/components/app-shell/page-title";
import {ContactSection} from "@/components/help/contact-section";
import {TopicCard, type HelpTopic} from "@/components/help/topic-card";
import {m} from "@/paraglide/messages";

const TOPICS: HelpTopic[] = [
  {id: "wallet", Icon: Wallet, title: m["help.topic_wallet"], description: m["help.topic_wallet_sub"]},
  {id: "shipments", Icon: Package, title: m["help.topic_shipments"], description: m["help.topic_shipments_sub"]},
  {id: "account", Icon: CircleUserRound, title: m["help.topic_account"], description: m["help.topic_account_sub"]},
];

/** `/help` — the Help & Support landing: topic cards plus the three contact channels. */
export function HelpPage() {
  useSetPageTitle(m["nav.help_support"]());

  return (
    <div className="mx-auto flex w-full max-w-[821px] flex-col gap-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.32px] text-black">{m["help.title"]()}</h1>
          <p className="max-w-[374px] text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["help.subtitle"]()}</p>
        </div>
        <img src={helpHeroUrl} alt="" aria-hidden="true" className="size-24 shrink-0" />
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["help.topics_title"]()}</h2>
        <div className="flex gap-4">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
