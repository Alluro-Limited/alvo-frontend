import {m} from "@/paraglide/messages";

interface PlaceholderPageProps {
  title: string;
}

/** Stand-in for sections that exist in the shell's navigation but aren't designed/built yet. */
export function PlaceholderPage({title}: PlaceholderPageProps) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-grey-300 bg-white p-10">
      <div className="text-center">
        <h1 className="text-xl leading-[1.2] font-medium text-primary-800">{title}</h1>
        <p className="mt-2 text-sm leading-[1.4] text-grey-500">{m["shell.placeholder_description"]()}</p>
      </div>
    </div>
  );
}
