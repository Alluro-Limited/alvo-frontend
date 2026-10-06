import {useCallback, useState} from "react";

/** Checkbox selection for the parcels table — keeps a Set of parcel ids across pages/filters. */
export function useParcelSelection() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());

  const toggleRow = useCallback((id: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[], checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  return {selected, toggleRow, toggleAll, clear};
}
