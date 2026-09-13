export type BenefitsContent = {
  eyebrow: string;
  heading: string;
  columns: 3 | 4;
  items: readonly {id: string; icon: string; title: string; body: string}[];
};

function BenefitCard({icon, title, body}: {icon: string; title: string; body: string}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-grey-200 bg-white p-6">
      <div className="flex size-10 items-center justify-center rounded-lg bg-grey-100 p-2">
        <img alt="" aria-hidden="true" className="size-6" src={icon} />
      </div>
      <h3 className="pt-2 text-base font-bold leading-[1.4] tracking-[0.01em] text-black">{title}</h3>
      <p className="text-sm leading-5 tracking-[-0.01em] text-grey-600">{body}</p>
    </div>
  );
}

export function BenefitsGrid({content}: {content: BenefitsContent}) {
  const grid = content.columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-24 text-center md:px-10 lg:px-30">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-[1.5px] bg-primary-500 shadow-[0_0_0_4px_#dceee8]" />
            <span className="text-xs font-medium tracking-[0.01em] text-primary-500">{content.eyebrow}</span>
          </div>
          <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[36px] lg:text-[42px]">
            {content.heading}
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${grid}`}>
          {content.items.map((item) => (
            <BenefitCard key={item.id} body={item.body} icon={item.icon} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
