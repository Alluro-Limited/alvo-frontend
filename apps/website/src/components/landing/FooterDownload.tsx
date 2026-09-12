import {footerContent} from "@/content/footer";

export function FooterDownload() {
  const {download} = footerContent;
  return (
    <a
      href={download.href}
      aria-label={`${download.title} — ${download.subtitle}`}
      className="inline-flex items-center gap-[51px] self-start rounded-xl bg-white p-3"
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium tracking-[0.01em] text-black">{download.title}</span>
        <span className="text-xs tracking-[0.01em] text-grey-600">{download.subtitle}</span>
      </span>
      <span className="shrink-0 rounded-[7.2px] bg-cream">
        <img src={download.qr} alt="" aria-hidden="true" className="size-12" />
      </span>
    </a>
  );
}
