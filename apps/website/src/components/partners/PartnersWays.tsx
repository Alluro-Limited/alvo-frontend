import {partnersWaysContent} from "@/content/partners";

const toneStyles = {
  success: {bg: "bg-success-50", title: "text-primary-500"},
  accent: {bg: "bg-accent-50", title: "text-accent-500"},
  secondary: {bg: "bg-secondary-50", title: "text-secondary-500"},
} as const;

function WayCard({icon, title, body, tone}: {icon: string; title: string; body: string; tone: keyof typeof toneStyles}) {
  const styles = toneStyles[tone];

  return (
    <div className={`flex h-96 flex-col justify-between rounded-2xl p-10 ${styles.bg}`}>
      <img alt="" aria-hidden="true" className="size-10" src={icon} />
      <div className="flex flex-col gap-2">
        <h3 className={`text-lg font-bold leading-[1.2] ${styles.title}`}>{title}</h3>
        <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600">{body}</p>
      </div>
    </div>
  );
}

export function PartnersWays() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-24 text-center md:px-10 lg:px-30">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-[1.5px] bg-primary-500 shadow-[0_0_0_4px_#dceee8]" />
            <span className="text-xs font-medium tracking-[0.01em] text-primary-500">{partnersWaysContent.eyebrow}</span>
          </div>
          <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[36px] lg:text-[42px]">
            {partnersWaysContent.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {partnersWaysContent.items.map((item) => (
            <WayCard key={item.id} body={item.body} icon={item.icon} title={item.title} tone={item.tone} />
          ))}
        </div>
      </div>
    </section>
  );
}
