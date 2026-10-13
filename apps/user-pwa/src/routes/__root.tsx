import {useEffect, type ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute} from "@tanstack/react-router";
import {startChunkRecovery} from "@/lib/chunk-recovery";
import {startServiceWorker} from "@/lib/pwa";
import {m} from "@/paraglide/messages";
import {getLocale} from "@/paraglide/runtime";
import {QueryProvider} from "@/providers/query-provider";

import appCss from "../index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {charSet: "utf-8"},
      // viewport-fit=cover lets the app draw under the notch in standalone mode.
      {name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover"},
      {title: m["app.title"]()},
      {name: "description", content: m["app.description"]()},
      // Internal tool: keep it out of search results.
      {name: "robots", content: "noindex, nofollow"},
      {name: "theme-color", content: "#00a996"},
      {name: "mobile-web-app-capable", content: "yes"},
      {name: "apple-mobile-web-app-capable", content: "yes"},
      {name: "apple-mobile-web-app-status-bar-style", content: "default"},
      {name: "apple-mobile-web-app-title", content: m["app.title"]()},
    ],
    links: [
      {rel: "stylesheet", href: appCss},
      {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"},
      {rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png"},
    ],
  }),
  shellComponent: RootDocument,
  component: RootApp,
});

let hasStartedBrowserSideEffects = false;

function useBrowserSideEffects() {
  useEffect(() => {
    if (hasStartedBrowserSideEffects) return;
    hasStartedBrowserSideEffects = true;
    startChunkRecovery();
    startServiceWorker();
  }, []);
}

function RootApp() {
  useBrowserSideEffects();

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
