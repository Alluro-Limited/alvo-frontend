import {smartLockersAccessContent} from "@/content/smart-lockers";

function AccessItem({icon, title, body, rotate}: {icon: string; title: string; body: string; rotate?: boolean}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-grey-100 p-2">
        <img alt="" aria-hidden="true" className={`size-5 ${rotate ? "rotate-90" : ""}`} src={icon} />
      </div>
      <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600">
        <span className="font-medium text-black">{title}</span> {body}
      </p>
    </div>
  );
}

export function SmartLockersAccess() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-24 md:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-30">
        <div className="flex w-full max-w-xl flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-[1.5px] bg-primary-500 shadow-[0_0_0_4px_#dceee8]" />
            <span className="text-xs font-medium tracking-[0.01em] text-primary-500">{smartLockersAccessContent.eyebrow}</span>
          </div>
          <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[32px]">
            {smartLockersAccessContent.heading}
          </h2>
          <p className="text-lg font-medium leading-[1.4] tracking-[0.01em] text-grey-600">{smartLockersAccessContent.subhead}</p>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3">
          {smartLockersAccessContent.items.map((item) => (
            <AccessItem key={item.id} body={item.body} icon={item.icon} rotate={item.rotate} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
