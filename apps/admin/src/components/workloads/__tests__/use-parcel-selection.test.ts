import {act, renderHook} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {useParcelSelection} from "../use-parcel-selection";

describe("useParcelSelection", () => {
  it("toggles individual rows", () => {
    const {result} = renderHook(() => useParcelSelection());

    act(() => result.current.toggleRow("PRV-1", true));
    act(() => result.current.toggleRow("PRV-2", true));
    expect([...result.current.selected]).toEqual(["PRV-1", "PRV-2"]);

    act(() => result.current.toggleRow("PRV-1", false));
    expect([...result.current.selected]).toEqual(["PRV-2"]);
  });

  it("toggles all rows of a page at once", () => {
    const {result} = renderHook(() => useParcelSelection());
    const ids = ["PRV-1", "PRV-2", "PRV-3"];

    act(() => result.current.toggleAll(ids, true));
    expect(result.current.selected.size).toBe(3);

    act(() => result.current.toggleAll(["PRV-1"], false));
    expect(result.current.selected.size).toBe(2);
  });

  it("clears the selection", () => {
    const {result} = renderHook(() => useParcelSelection());

    act(() => result.current.toggleAll(["PRV-1", "PRV-2"], true));
    act(() => result.current.clear());
    expect(result.current.selected.size).toBe(0);
  });
});
