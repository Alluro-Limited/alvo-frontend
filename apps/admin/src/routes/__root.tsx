import {useEffect, type ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute} from "@tanstack/react-router";
import {QueryProvider} from "@/providers/query-provider";
import {startChunkRecovery} from "@/lib/chunk-recovery";
import {m} from "@/paraglide/messages";
import {getLocale} from "@/paraglide/runtime";

import appCss from "../index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {charSet: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1.0"},
      {title: m["app.title"]()},
      {name: "description", content: m["app.description"]()},
      // Internal tool: keep it out of search results.
      {name: "robots", content: "noindex, nofollow"},
    ],
    links: [{rel: "stylesheet", href: appCss}],
  }),
  shellComponent: RootDocument,
  component: RootApp,
});

let hasStartedChunkRecovery = false;

function useChunkRecovery() {
  useEffect(() => {
    if (hasStartedChunkRecovery) return;
    hasStartedChunkRecovery = true;
    startChunkRecovery();
  }, []);
}

function RootApp() {
  useChunkRecovery();

  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  );
}

function RootDocument({children}: {children: ReactNode}) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
