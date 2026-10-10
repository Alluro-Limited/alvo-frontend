import {useQueryClient} from "@tanstack/react-query";
import {render} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {queryClient} from "@/queries/query-client";
import {QueryProvider} from "../query-provider";

function CaptureClient({onClient}: {onClient: (client: ReturnType<typeof useQueryClient>) => void}) {
  onClient(useQueryClient());
  return null;
}

describe("QueryProvider", () => {
  it("provides the shared query client", () => {
    let provided: ReturnType<typeof useQueryClient> | undefined;
    render(
      <QueryProvider>
        <CaptureClient onClient={(client) => (provided = client)} />
      </QueryProvider>
    );

    expect(provided).toBe(queryClient);
  });

  it("keeps data fresh for five minutes and skips refetch on window focus", () => {
    const defaults = queryClient.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(300_000);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
  });
});
