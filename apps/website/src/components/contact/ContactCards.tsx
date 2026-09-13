import {ArrowRight, Lock, Users} from "lucide-react";

import {contactCardsContent} from "@/content/contact";

type IconKey = "lock" | "users";

const icons: Record<IconKey, typeof Lock> = {
  lock: Lock,
  users: Users,
};

export function ContactCards() {
  return (
    <section className="bg-white px-6 pb-24 sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-[1128px] flex-col items-start">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {contactCardsContent.cards.map((card) => {
            const Icon = icons[card.icon as IconKey];
            return (
              <div key={card.id} className="flex w-full flex-col items-start gap-6 rounded-xl border border-grey-200 bg-white px-6 py-7">
                <div className="flex items-center justify-center rounded-lg bg-grey-100 p-3">
                  <Icon className="size-6 text-primary-500" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-sans text-lg font-medium leading-[1.2] text-black">{card.title}</h2>
                    <p className="font-sans text-sm font-normal leading-[1.4] tracking-[0.14px] text-grey-600">{card.body}</p>
                  </div>

                  <a
                    href={card.href}
                    className="group inline-flex items-center gap-1.5 font-sans text-sm font-medium tracking-[0.14px] text-primary-500"
                  >
                    {card.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
