import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider, type RouteComponent} from "@tanstack/react-router";
import {render} from "@testing-library/react";

/** Destinations the auth pages link or redirect to, each rendering its own path so tests can assert arrival. */
const STUB_PATHS = [
  "/",
  "/dashboard",
  "/forgot-password",
  "/reset-password",
  "/account-setup",
  "/assignment",
  "/users",
  "/nodes",
  "/nodes/$nodeId",
  "/workloads",
  "/workloads/batches/$batchId",
];

/** Renders `component` at `path` in a memory router (with stub sibling routes) and a fresh query client. */
export function renderRoute(component: RouteComponent, path: string, initialEntry: string = path) {
  const rootRoute = createRootRoute();
  const stubs = STUB_PATHS.filter((stub) => stub !== path).map((stub) =>
    createRoute({getParentRoute: () => rootRoute, path: stub, component: () => <p>{`stub:${stub}`}</p>})
  );
  const routeTree = rootRoute.addChildren([createRoute({getParentRoute: () => rootRoute, path, component}), ...stubs]);
  const router = createRouter({routeTree, history: createMemoryHistory({initialEntries: [initialEntry]})});
  const queryClient = new QueryClient({defaultOptions: {mutations: {retry: false}}});
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
  return router;
}
