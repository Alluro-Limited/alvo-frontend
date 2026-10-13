import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

interface UpdatedViewProps {
  title: string;
  description: string;
  /** The new value shown in the grey pill (name or phone). */
  value: string;
  onDone: () => void;
}

/** Shared success view for the personal-info update sheets — check badge, new value, Done. */
export function UpdatedView({title, description, value, onDone}: UpdatedViewProps) {
  return (
    <div className="mt-4 flex w-full flex-col items-center pb-4">
      <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-14" />
      <h2 className="mt-4 text-center text-[18px] font-medium leading-[1.3] text-foreground">{title}</h2>
      <p className="mt-2 max-w-[280px] text-center text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{description}</p>
      <span className="mt-4 flex w-full items-center justify-center rounded-[8px] bg-[#f9f9f9] px-4 py-3.5 text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-foreground">
        {value}
      </span>
      <Button className="mt-6 w-full text-[16px] font-medium" onClick={onDone}>
        {m["acc.done"]()}
      </Button>
    </div>
  );
}
