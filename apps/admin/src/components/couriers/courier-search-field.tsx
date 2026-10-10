import wlSearch from "@/assets/wl-search.svg";
import {FIELD_CLASSES} from "@/components/workloads/select-shell";

/** The icon-led search field shared by the couriers toolbar, map panel, and history modal. */
export function CourierSearchField({
  value,
  placeholder,
  onQuery,
  className,
}: {
  value: string;
  placeholder: string;
  onQuery: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <img src={wlSearch} alt="" className="pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${FIELD_CLASSES} pl-12 placeholder:text-grey-500`}
      />
    </div>
  );
}
