import type {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {act, renderHook} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {useSignInMutation} from "../use-sign-in-mutation";

vi.mock("@/services/auth-service", () => ({authService: {signIn: vi.fn(async () => {})}}));

describe("useSignInMutation", () => {
  it("signs in and invalidates every cached query for the new session", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({children}: {children: ReactNode}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    const {result} = renderHook(() => useSignInMutation(), {wrapper});

    await act(() => result.current.mutateAsync({email: "ada@alvo.com", password: "secret"}));

    expect(vi.mocked(authService.signIn).mock.calls[0][0]).toEqual({email: "ada@alvo.com", password: "secret"});
    expect(invalidate).toHaveBeenCalledWith();
  });
});
