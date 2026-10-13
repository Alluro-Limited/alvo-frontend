import {PrefToggle} from "./pref-toggle";

interface PrefRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** One divider-separated notification preference: label + description + toggle. */
export function PrefRow({label, description, checked, onChange}: PrefRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-[0.5px] border-grey-400 py-4">
      <div>
        <p className="text-[14px] font-medium">{label}</p>
        <p className="text-[12px] text-grey-500">{description}</p>
      </div>
      <PrefToggle checked={checked} label={label} onChange={onChange} />
    </div>
  );
}
