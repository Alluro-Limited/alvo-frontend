import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider} from "@tanstack/react-router";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {AppShell} from "../app-shell";

vi.mock("@/services/auth-service", () => ({
  authService: {
    getCurrentUser: vi.fn(async () => ({name: "Dayo Ogunseye"})),
    signOut: vi.fn(async () => {}),
  },
}));

const SHELL_PATHS = [
  "/dashboard",
  "/workloads",
  "/nodes",
  "/assignment",
  "/users",
  "/smes",
  "/couriers",
  "/revenue",
  "/courier-payouts",
  "/admins",
  "/settings",
  "/profile",
];

/** Mounts the real shell as a pathless layout over stub pages, in a memory router + query client. */
async function renderShell(initialPath = "/dashboard") {
  const rootRoute = createRootRoute();
  const layout = createRoute({getParentRoute: () => rootRoute, id: "shell", component: AppShell});
  const signIn = createRoute({getParentRoute: () => rootRoute, path: "/", component: () => <p>page:/</p>});
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      layout.addChildren(
        SHELL_PATHS.map((path) => createRoute({getParentRoute: () => layout, path, component: () => <p>{`page:${path}`}</p>}))
      ),
      signIn,
    ]),
    history: createMemoryHistory({initialEntries: [initialPath]}),
  });
  await router.load();
  const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}, mutations: {retry: false}}});
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
  return router;
}

const sidebar = () => within(screen.getByRole("complementary"));

describe("AppShell", () => {
  it("renders the sidebar sections and marks the current page active", async () => {
    await renderShell();

    for (const label of ["nav.home", "nav.operations", "nav.accounts", "nav.finance", "nav.system", "nav.preferences"]) {
      expect(sidebar().getByText(label)).toBeTruthy();
    }
    expect(await screen.findByText("page:/dashboard")).toBeTruthy();

    const overviewLink = sidebar().getByRole("link", {name: "nav.overview"});
    expect(overviewLink.className).toContain("bg-primary-500");
    expect(sidebar().getByRole("link", {name: "nav.nodes"}).className).not.toContain("bg-primary-500");
  });

  it("updates the breadcrumb and content when navigating to another section", async () => {
    await renderShell();

    fireEvent.click(sidebar().getByRole("link", {name: "nav.nodes"}));

    expect(await screen.findByText("page:/nodes")).toBeTruthy();
    expect(screen.getByRole("navigation", {name: "Breadcrumb"}).textContent).toContain("nav.nodes");
    expect(sidebar().getByRole("link", {name: "nav.nodes"}).className).toContain("bg-primary-500");
  });

  it("collapses to an icon-only rail and expands again", async () => {
    await renderShell();

    fireEvent.click(screen.getByRole("button", {name: "shell.collapse_sidebar"}));
    expect(sidebar().queryByText("nav.operations")).toBeNull();
    expect(screen.getByRole("button", {name: "shell.expand_sidebar"})).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "shell.expand_sidebar"}));
    expect(sidebar().getByText("nav.operations")).toBeTruthy();
  });

  it("shows the signed-in admin's initial in the avatar", async () => {
    await renderShell();

    expect(await screen.findByText("D")).toBeTruthy();
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it("focuses the search field on ⌘K", async () => {
    await renderShell();

    fireEvent.keyDown(window, {key: "k", metaKey: true});

    expect(document.activeElement).toBe(screen.getByPlaceholderText("shell.search_placeholder"));
  });

  it("signs out and returns to the sign-in page", async () => {
    const router = await renderShell();

    fireEvent.click(sidebar().getByRole("button", {name: "nav.logout"}));

    expect(await screen.findByText("page:/")).toBeTruthy();
    expect(authService.signOut).toHaveBeenCalled();
    expect(router.state.location.pathname).toBe("/");
  });
});
