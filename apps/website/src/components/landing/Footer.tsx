import {FooterColumn} from "./FooterColumn";
import {FooterDownload} from "./FooterDownload";

import {footerContent} from "@/content/footer";

export function Footer() {
  const {brand, columns, copyright, socials} = footerContent;
  return (
    <footer className="bg-primary-500 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-20 px-6 pt-20 pb-12 md:px-10 lg:px-30 lg:pt-30 lg:pb-15">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex w-full max-w-[383px] flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img src={brand.mark} alt="" aria-hidden="true" className="size-10" />
                <span className="text-2xl font-medium tracking-[-0.01em] text-white">{brand.name}</span>
              </div>
              <p className="text-sm leading-[1.4] tracking-[0.01em] text-white">{brand.blurb}</p>
            </div>
            <FooterDownload />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:max-w-[668px] lg:flex-1 lg:gap-6">
            {columns.map((column) => (
              <FooterColumn key={column.title} column={column} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base tracking-[0.01em] text-white">{copyright}</p>
          <ul className="flex gap-2.5">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-lg border-[0.5px] border-white/50 bg-white/12 transition-colors hover:bg-white/25"
                >
                  <img src={social.icon} alt="" aria-hidden="true" className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
