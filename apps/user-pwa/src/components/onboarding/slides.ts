import type {SimpleMessage} from "@/lib/i18n";
import mokker1Url from "@/assets/mokker-1.png";
import mokker2Url from "@/assets/mokker-2.png";
import mokker3Url from "@/assets/mokker-3.png";

export interface OnboardingSlide {
  titleKey: SimpleMessage;
  image: string;
  /** Vertical offset (px) applied to the oversized mokker image inside its 418px window. */
  imageTop: number;
}

/** The three onboarding slides; the design shares one description and crops each mokker differently. */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {titleKey: "onb.s1_title", image: mokker1Url, imageTop: -249},
  {titleKey: "onb.s2_title", image: mokker2Url, imageTop: -480},
  {titleKey: "onb.s3_title", image: mokker3Url, imageTop: -366},
];
