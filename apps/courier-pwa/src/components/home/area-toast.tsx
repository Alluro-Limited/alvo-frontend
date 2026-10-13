import {useEffect, useState} from "react";
import {CircleCheck} from "lucide-react";
import {areaToast} from "@/lib/area-toast";
import {m} from "@/paraglide/messages";

/** Bottom-pinned "Delivery area changed" pill — fires once after the picker confirms. */
export function AreaToast() {
  const [visible, setVisible] = useState(() => {
    if (!areaToast.pending) return false;
    areaToast.pending = false;
    return true;
  });

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <p className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium shadow-lg">
      <CircleCheck className="size-4 text-success-500" aria-hidden="true" />
      {m["area.changed"]()}
    </p>
  );
}
