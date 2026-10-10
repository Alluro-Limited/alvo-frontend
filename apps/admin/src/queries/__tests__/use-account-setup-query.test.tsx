import type {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {renderHook, waitFor} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {accountSetupQueryKey, useAccountSetupQuery} from "../use-account-setup-query";

vi.mock("@/services/auth-service", () => ({authService: {getAccountSetup: vi.fn()}}));

const getAccountSetup = vi.mocked(authService.getAccountSetup);

function renderQuery(queryClient = new QueryClient()) {
  const wrapper = ({children}: {children: ReactNode}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  return {queryClient, ...renderHook(() => useAccountSetupQuery(), {wrapper})};
}

describe("useAccountSetupQuery", () => {
  it("caches the invitation under the account-setup key", async () => {
    const invitation = {invitedBy: "Dayo Ogunseye", roleLabel: "Business analyst · Read-only finance"};
    getAccountSetup.mockResolvedValue(invitation);
    const {result, queryClient} = renderQuery();

    await waitFor(() => expect(result.current.data).toEqual(invitation));
    expect(queryClient.getQueryData(accountSetupQueryKey)).toEqual(invitation);
  });

  it("surfaces a failed invitation fetch once, without retrying", async () => {
    getAccountSetup.mockRejectedValue(new Error("gone"));
    const {result} = renderQuery();

    await waitFor(() => expect(result.current.error?.message).toBe("gone"));
    expect(getAccountSetup).toHaveBeenCalledTimes(1);
  });
});
