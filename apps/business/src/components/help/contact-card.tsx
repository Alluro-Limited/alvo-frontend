import {useState, type ReactNode} from "react";
import type {LucideIcon} from "lucide-react";
import {Check, Copy} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

interface ContactCardProps {
  Icon: LucideIcon;
  iconClassName: string;
  title: string;
  subtitle: string;
  /** The small grey print under the subtitle (reply time, hours). */
  note: string;
  children: ReactNode;
}

/** A "Still need help?" card — colored icon chip, availability copy, and an action slot. */
export function ContactCard({Icon, iconClassName, title, subtitle, note, children}: ContactCardProps) {
  return (
    <article className="flex flex-1 flex-col gap-3 rounded-xl border border-grey-200 bg-white p-4">
      <div className={cn("flex size-7 items-center rounded p-1", iconClassName)}>
        <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</h3>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600 opacity-70">{subtitle}</p>
        </div>
        <p className="text-[10px] leading-[1.4] tracking-[0.1px] whitespace-pre-line text-grey-500 opacity-70">{note}</p>
      </div>
      {children}
    </article>
  );
}

/** The outline value + copy-button row used by the email and call cards. */
export function CopyAction({value, label}: {value: string; label: string}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="flex h-[38px] flex-1 items-center justify-center rounded-lg border-[0.75px] border-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-primary-500"
      >
        {copied ? m["help.copied"]() : value}
      </button>
      <span aria-hidden="true" className="flex size-5 items-center justify-center text-primary-500">
        {copied ? <Check className="size-5" strokeWidth={1.5} /> : <Copy className="size-5" strokeWidth={1.5} />}
      </span>
    </div>
  );
}
