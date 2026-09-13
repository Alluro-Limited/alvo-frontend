import {Accordion, AccordionItem, AccordionPanel, AccordionTrigger} from "@alvo/ui";

import {Eyebrow} from "./Eyebrow";

type FaqContent = {eyebrow: string; heading: string; items: readonly {q: string; a: string}[]};

export function Faq({content, id = "faq"}: {content: FaqContent; id?: string}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-14 px-6 py-16 md:px-10 lg:py-25">
        <div className="flex flex-col items-center gap-5 text-center">
          <Eyebrow label={content.eyebrow} />
          <h2
            id={`${id}-heading`}
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[40px] lg:text-[48px]"
          >
            {content.heading}
          </h2>
        </div>

        <Accordion className="max-w-[560px]">
          {content.items.map((item, index) => (
            <AccordionItem key={item.q} value={index}>
              <AccordionTrigger>
                <span className="text-base font-medium tracking-[0.01em] text-black">{item.q}</span>
              </AccordionTrigger>
              <AccordionPanel>
                <p className="px-4 pt-2 pb-4 text-sm leading-[1.4] tracking-[0.01em] text-grey-500">{item.a}</p>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
