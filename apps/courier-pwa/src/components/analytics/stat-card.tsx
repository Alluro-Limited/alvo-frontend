import {CircleDot} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
}

/** One grey stat tile on Analytics: small teal marker + grey label + bold value. */
export function StatCard({label, value}: StatCardProps) {
  return (
    <div className="rounded-[12px] bg-grey-50 p-3.5">
      <p className="flex items-center gap-1.5 text-[11px] text-grey-500">
        <CircleDot className="size-3 text-primary-500" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-[18px] font-bold tracking-[-0.01em]">{value}</p>
    </div>
  );
}
