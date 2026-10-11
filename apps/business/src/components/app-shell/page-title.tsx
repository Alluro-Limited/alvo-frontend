import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from "react";

/**
 * Lets a page replace the route-derived header title with a dynamic one —
 * e.g. the batch name on `/shipments/:batchId` instead of the nav label.
 */
const PageTitleContext = createContext<{
  title: string | null;
  setTitle: (title: string | null) => void;
} | null>(null);

export function PageTitleProvider({children}: {children: ReactNode}) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({title, setTitle}), [title]);
  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  return context?.title ?? null;
}

/** Call from a page to own the header title; clears on unmount or when it changes. */
export function useSetPageTitle(title: string | null) {
  const context = useContext(PageTitleContext);
  useEffect(() => {
    context?.setTitle(title);
    return () => context?.setTitle(null);
  }, [context, title]);
}
