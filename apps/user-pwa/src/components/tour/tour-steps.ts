import type {SimpleMessage} from "@/lib/i18n";

export type TourSpotlight = "header" | "send" | "store" | "nav";

export type TourPointer = "left" | "down-left" | "up-right" | "down-near-left" | "down-center" | "down-right";

export interface TourStep {
  spotlight: TourSpotlight;
  /** Optional teal-800 bold heading (tile steps). */
  titleKey?: SimpleMessage;
  bodyKey: SimpleMessage;
  /** Tooltip box position inside the 390px-wide stage. */
  tipClass: string;
  pointer: TourPointer;
  last?: boolean;
}

/** First-visit coach marks over the home screen, in order. */
export const TOUR_STEPS: TourStep[] = [
  {
    spotlight: "header",
    bodyKey: "tour.location",
    tipClass: "left-[114px] top-[29px] w-[222px]",
    pointer: "left",
  },
  {
    spotlight: "send",
    titleKey: "tour.send_title",
    bodyKey: "tour.send",
    tipClass: "left-[24px] top-[38px] w-[330px]",
    pointer: "down-left",
  },
  {
    spotlight: "store",
    titleKey: "tour.store_title",
    bodyKey: "tour.store",
    tipClass: "left-[37px] top-[281px] w-[330px]",
    pointer: "up-right",
  },
  {
    spotlight: "nav",
    bodyKey: "tour.activities",
    tipClass: "left-[116px] top-[622px] w-[232px]",
    pointer: "down-near-left",
  },
  {
    spotlight: "nav",
    bodyKey: "tour.support",
    tipClass: "left-[128px] top-[622px] w-[232px]",
    pointer: "down-center",
  },
  {
    spotlight: "nav",
    bodyKey: "tour.account",
    tipClass: "left-[135px] top-[622px] w-[232px]",
    pointer: "down-right",
    last: true,
  },
];
