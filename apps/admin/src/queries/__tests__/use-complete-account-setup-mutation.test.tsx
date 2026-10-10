import type {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {act, renderHook} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {useCompleteAccountSetupMutation} from "../use-complete-account-setup-mutation";

vi.mock("@/services/auth-service", () => ({authService: {completeAccountSetup: vi.fn(async () => {})}}));

describe("useCompleteAccountSetupMutation", () => {
  it("activates the account and drops anything cached for the invited session", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({children}: {children: ReactNode}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    const {result} = renderHook(() => useCompleteAccountSetupMutation(), {wrapper});

    const input = {firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"};
    await act(() => result.current.mutateAsync(input));

    expect(vi.mocked(authService.completeAccountSetup).mock.calls[0][0]).toEqual(input);
    expect(invalidate).toHaveBeenCalledWith();
  });
});
