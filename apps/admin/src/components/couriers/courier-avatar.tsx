import {cn} from "cnfast";

const PALETTES = [
  "bg-primary-100 text-primary-600",
  "bg-secondary-50 text-secondary-500",
  "bg-accent-50 text-accent-500",
  "bg-status-warning-subtle text-status-warning-dark",
  "bg-status-fail-subtle text-status-fail-dark",
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function paletteFor(id: string): string {
  const seed = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTES[seed % PALETTES.length];
}

/** Round courier photo — falls back to a deterministic initials badge while no photo exists. */
export function CourierAvatar({id, name, photoUrl, size = "size-7"}: {id: string; name: string; photoUrl: string | null; size?: string}) {
  if (photoUrl) {
    return <img src={photoUrl} alt="" className={cn("shrink-0 rounded-full object-cover", size)} />;
  }
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold", size, paletteFor(id))}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
