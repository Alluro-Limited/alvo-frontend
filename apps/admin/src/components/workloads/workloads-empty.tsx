interface WorkloadsEmptyProps {
  icon: string;
  title: string;
  description: string;
}

/** Centered empty panel shown when the filtered list returns no items. */
export function WorkloadsEmpty({icon, title, description}: WorkloadsEmptyProps) {
  return (
    <div className="flex min-h-[480px] items-center justify-center rounded-lg bg-white">
      <div className="flex w-[295px] flex-col items-center gap-4 text-center">
        <img src={icon} alt="" className="size-12" aria-hidden="true" />
        <div className="flex flex-col">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</p>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
