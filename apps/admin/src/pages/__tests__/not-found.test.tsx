import {createMemoryHistory, createRootRoute, createRouter, RouterProvider} from "@tanstack/react-router";
import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {NotFoundPage} from "../not-found";

function renderInRouter() {
  const rootRoute = createRootRoute({component: NotFoundPage});
  const router = createRouter({routeTree: rootRoute, history: createMemoryHistory({initialEntries: ["/missing"]})});
  return render(<RouterProvider router={router} />);
}

describe("NotFoundPage", () => {
  it("explains the page is missing and links back home", async () => {
    renderInRouter();

    expect(await screen.findByRole("heading", {level: 1, name: "not_found.title"})).toBeTruthy();
    expect(screen.getByText("not_found.description")).toBeTruthy();
    // Base UI renders the link with role="button" so it reads like the button it looks like.
    expect(screen.getByRole("button", {name: "not_found.return_home"}).getAttribute("href")).toBe("/");
  });
});
