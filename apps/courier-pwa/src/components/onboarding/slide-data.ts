import assignmentUrl from "@/assets/onboarding-assignment.png";
import deliverUrl from "@/assets/onboarding-deliver.png";
import paidUrl from "@/assets/onboarding-paid.png";

export interface OnboardingSlide {
  titleKey: "ob.slide1_title" | "ob.slide2_title" | "ob.slide3_title";
  subKey: "ob.slide1_sub" | "ob.slide2_sub" | "ob.slide3_sub";
  image: string;
  /** Rendered width in px — slide 1 bleeds wider than the 390px frame per the design. */
  imageWidth: number;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    titleKey: "ob.slide1_title",
    subKey: "ob.slide1_sub",
    image: assignmentUrl,
    imageWidth: 465,
  },
  {
    titleKey: "ob.slide2_title",
    subKey: "ob.slide2_sub",
    image: deliverUrl,
    imageWidth: 439,
  },
  {
    titleKey: "ob.slide3_title",
    subKey: "ob.slide3_sub",
    image: paidUrl,
    imageWidth: 439,
  },
];
