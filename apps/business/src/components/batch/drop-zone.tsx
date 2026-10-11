import {useRef} from "react";
import {CircleArrowUp} from "lucide-react";
import {m} from "@/paraglide/messages";

/** Click-or-drop file picker for the CSV upload tab. */
export function DropZone({onFile}: {onFile: (file: File) => void}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-grey-300 bg-[#f9f9f9] px-4 py-6 text-center"
    >
      <CircleArrowUp className="size-10 text-primary-500" strokeWidth={1.25} aria-hidden="true" />
      <span className="flex flex-col gap-1">
        <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">
          {m["wiz.drop_title"]()} <span className="text-primary-500 underline">{m["wiz.browse"]()}</span>
        </span>
        <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wiz.supports"]()}</span>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        aria-label={m["wiz.tab_csv"]()}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
