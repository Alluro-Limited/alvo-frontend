import {useRouter} from "@tanstack/react-router";
import {ArrowLeft} from "lucide-react";
import {m} from "@/paraglide/messages";

/** The grey circular back button + 24px title shared by the account sub-pages. */
export function PageHeader({title}: {title: string}) {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-4">
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label={m["nt.back"]()}
        className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f2]"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </button>
      <h1 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{title}</h1>
    </div>
  );
}
