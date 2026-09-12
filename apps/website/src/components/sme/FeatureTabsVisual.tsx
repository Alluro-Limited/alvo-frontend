import {smeFeatureTabsContent} from "@/content/sme";
import {AnalyticsMockup} from "./AnalyticsMockup";
import {BatchMockup} from "./BatchMockup";
import {TeamMockup} from "./TeamMockup";
import {WalletMockup} from "./WalletMockup";

type TabId = (typeof smeFeatureTabsContent.tabs)[number]["id"];

export function FeatureTabsVisual({active}: {active: TabId}) {
  return (
    <>
      {active === "batch" && <BatchMockup />}
      {active === "analytics" && <AnalyticsMockup />}
      {active === "wallet" && <WalletMockup />}
      {active === "team" && <TeamMockup />}
    </>
  );
}
