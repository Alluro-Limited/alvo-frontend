import {footerContent} from "@/content/footer";
import {NavLink} from "@/components/landing/NavLink";

type Column = (typeof footerContent.columns)[number];

export function FooterColumn({column}: {column: Column}) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <h3 className="text-sm font-medium tracking-[0.01em] text-white">{column.title}</h3>
      <ul className="flex flex-col gap-[11px]">
        {column.links.map((link) => (
          <li key={link.label} className="py-0.5">
            <NavLink href={link.href} className="text-sm tracking-[0.01em] text-grey-100 transition-colors hover:text-white">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
