import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import type {OverviewMap} from "@/types/dashboard-types";
import type {MapFilter} from "../map-sync";
import {useMarkerSelection} from "../use-marker-selection";

const node = {id: "LK-1", position: [3.4, 6.5] as [number, number], status: "online" as const};
const node2 = {id: "LK-2", position: [3.45, 6.55] as [number, number], status: "online" as const};
const courier = {id: "PRG-1", position: [3.5, 6.6] as [number, number], status: "online" as const};
const base: OverviewMap = {nodes: [node, node2], couriers: [courier], route: []};

function renderSelection(data: OverviewMap = base, filter: MapFilter = "all") {
  return renderHook(({data: d, filter: f}) => useMarkerSelection(d, f), {initialProps: {data, filter}});
}

describe("useMarkerSelection", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens immediately on marker hover and anchors to its position", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));

    expect(result.current.anchor).toEqual([3.4, 6.5]);
  });

  it("follows the marker when refreshed data moves it", () => {
    const {result, rerender} = renderSelection();
    act(() => result.current.open({kind: "courier", id: "PRG-1"}));

    rerender({data: {...base, couriers: [{...courier, position: [3.9, 6.9]}]}, filter: "all"});
    expect(result.current.anchor).toEqual([3.9, 6.9]);
  });

  it("drops the anchor when the marker leaves the data", () => {
    const {result, rerender} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));

    rerender({data: {...base, nodes: []}, filter: "all"});
    expect(result.current.anchor).toBeNull();
  });

  it("drops the anchor when the filter hides the marker kind", () => {
    const {result, rerender} = renderSelection();
    act(() => result.current.open({kind: "courier", id: "PRG-1"}));
    expect(result.current.anchor).not.toBeNull();

    rerender({data: base, filter: "nodes"});
    expect(result.current.anchor).toBeNull();
  });

  it("closes after the delay once the pointer leaves to the map", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));

    act(() => result.current.leave({kind: "node", id: "LK-1"}));
    expect(result.current.selection).not.toBeNull();

    act(() => vi.advanceTimersByTime(300));
    expect(result.current.selection).toBeNull();
    expect(result.current.anchor).toBeNull();
  });

  it("stays open when the pointer crosses to the card before the marker leave lands", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));

    // Pointer events fire enter(card) before leave(marker).
    act(() => result.current.enterCard());
    act(() => result.current.leave({kind: "node", id: "LK-1"}));
    act(() => vi.advanceTimersByTime(400));

    expect(result.current.selection).not.toBeNull();
  });

  it("closes when the pointer leaves the card to the map", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));
    act(() => result.current.enterCard());
    act(() => result.current.leave({kind: "node", id: "LK-1"}));

    act(() => result.current.leaveCard());
    act(() => vi.advanceTimersByTime(300));

    expect(result.current.selection).toBeNull();
  });

  it("stays open when moving card back to a marker, whichever order events arrive", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));
    act(() => result.current.enterCard());
    act(() => result.current.leave({kind: "node", id: "LK-1"}));

    // Cursor goes card -> marker B: enter(B) lands before leave(card).
    act(() => result.current.open({kind: "node", id: "LK-2"}));
    act(() => result.current.leaveCard());
    act(() => vi.advanceTimersByTime(400));

    expect(result.current.selection).toEqual({kind: "node", id: "LK-2"});
  });

  it("clears immediately", () => {
    const {result} = renderSelection();
    act(() => result.current.open({kind: "node", id: "LK-1"}));
    act(() => result.current.clear());

    expect(result.current.selection).toBeNull();
    expect(result.current.anchor).toBeNull();
  });
});
