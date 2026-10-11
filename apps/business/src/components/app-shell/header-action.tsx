import {createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode} from "react";

/**
 * Lets a page own the header's primary action — e.g. `/wallet` swaps the
 * balance + bell for a "Top up wallet" button that opens the page's dialog.
 */
const HeaderActionContext = createContext<{
  action: (() => void) | null;
  setAction: (action: (() => void) | null) => void;
} | null>(null);

export function HeaderActionProvider({children}: {children: ReactNode}) {
  const [action, setAction] = useState<(() => void) | null>(null);
  const value = useMemo(() => ({action, setAction}), [action]);
  return <HeaderActionContext.Provider value={value}>{children}</HeaderActionContext.Provider>;
}

export function useHeaderAction() {
  return useContext(HeaderActionContext)?.action ?? null;
}

/** Register a click handler for the header action; cleared on unmount. */
export function useSetHeaderAction(action: () => void) {
  const context = useContext(HeaderActionContext);
  const ref = useRef(action);
  useEffect(() => {
    ref.current = action;
  }, [action]);
  useEffect(() => {
    const stable = () => ref.current();
    context?.setAction(() => stable);
    return () => context?.setAction(null);
  }, [context]);
}
