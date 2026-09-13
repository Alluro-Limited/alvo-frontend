import {Accordion, AccordionItem, AccordionPanel, AccordionTrigger} from "@alvo/ui";

import {Eyebrow} from "@/components/landing/Eyebrow";
import {helpFaqContent} from "@/content/help";

export function HelpFaq() {
  return (
    <section className="bg-white px-6 pt-[60px] pb-[120px] sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <Eyebrow label={helpFaqContent.eyebrow} />
          <h2 className="font-sans text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-black sm:text-[42px] sm:tracking-[-0.42px]">
            {helpFaqContent.heading}
          </h2>
        </div>

        <Accordion className="w-full max-w-[560px]">
          {helpFaqContent.items.map((item, index) => (
            <AccordionItem key={item.q} value={index}>
              <AccordionTrigger>
                <span className="text-base font-medium leading-[1.4] tracking-[0.16px] text-black">{item.q}</span>
              </AccordionTrigger>
              <AccordionPanel>
                <p className="pb-4 pl-4 pr-14 text-sm font-normal leading-[1.4] tracking-[0.14px] text-grey-500">{item.a}</p>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
