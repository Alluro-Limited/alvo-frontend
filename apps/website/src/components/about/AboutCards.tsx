import {Target, Telescope} from "lucide-react";

import {StatementCards} from "@/components/StatementCards";
import {aboutCardsContent} from "@/content/about";

const icons = {
  mission: <Target className="size-6 shrink-0 text-white" />,
  vision: <Telescope className="size-6 shrink-0 text-black" />,
} as const;

export function AboutCards() {
  return <StatementCards cards={aboutCardsContent.cards} icons={icons} />;
}
