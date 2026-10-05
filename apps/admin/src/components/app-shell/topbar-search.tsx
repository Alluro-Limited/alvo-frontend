import {useEffect, useRef} from "react";
import {Search} from "lucide-react";
import {m} from "@/paraglide/messages";

/** The centered search field; ⌘K focuses it, matching the hint shown inside. */
export function TopbarSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="absolute left-1/2 hidden w-[342px] -translate-x-1/2 items-center gap-1 rounded-lg border border-grey-300 px-3 py-1.5 lg:flex">
      <Search aria-hidden="true" className="size-4 shrink-0 text-grey-600" />
      <input
        ref={inputRef}
        type="search"
        placeholder={m["shell.search_placeholder"]()}
        className="min-w-0 flex-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-600"
      />
      <kbd className="shrink-0 font-sans text-sm leading-5 text-[rgba(28,28,28,0.3)]">⌘K</kbd>
    </div>
  );
}
