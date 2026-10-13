import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {homeService} from "@/services/home-service";
import {renderRoute} from "@/test/render-route";
import type {DeliveryArea} from "@/types/home-types";
import {DeliveryAreaPage} from "../delivery-area";

vi.mock("@/services/home-service", () => ({
  homeService: {getAreas: vi.fn(), setDeliveryArea: vi.fn()},
}));

const getAreas = vi.mocked(homeService.getAreas);
const setDeliveryArea = vi.mocked(homeService.setDeliveryArea);

const AREAS: DeliveryArea[] = [
  {id: "lekki-mall", name: "Lekki Mall Node", address: "Second Entrance, Lekki Mall Node, Lagos State"},
  {id: "ikorodu", name: "Ikorodu Node", address: "Ikorodu, Lagos State"},
];

describe("DeliveryAreaPage", () => {
  beforeEach(() => {
    getAreas.mockReset().mockResolvedValue(AREAS);
    setDeliveryArea.mockReset().mockResolvedValue(undefined);
  });

  it("keeps Confirm disabled until an area is selected, then returns home", async () => {
    renderRoute(DeliveryAreaPage, "/delivery-area");
    const confirm = await screen.findByRole("button", {name: "area.confirm"});
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(await screen.findByText("Ikorodu Node"));
    fireEvent.click(confirm);
    await waitFor(() => expect(setDeliveryArea).toHaveBeenCalledWith("ikorodu"));
    expect(await screen.findByText("stub:/home")).toBeTruthy();
  });

  it("lists every area option", async () => {
    renderRoute(DeliveryAreaPage, "/delivery-area");
    expect(await screen.findByText("Lekki Mall Node")).toBeTruthy();
    expect(screen.getByText("Ikorodu Node")).toBeTruthy();
  });
});
