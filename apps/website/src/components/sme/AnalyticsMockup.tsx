import {Clock, DollarSign, Package, Truck} from "lucide-react";

import {smeFeatureTabsContent} from "@/content/sme";
import {MockupFrame} from "./MockupFrame";

const toneClass: Record<string, string> = {
  primary: "bg-primary-50 text-primary-500",
  secondary: "bg-secondary-50 text-secondary-600",
  success: "bg-success-50 text-success-600",
};

export function AnalyticsMockup() {
  const content = smeFeatureTabsContent.mockups.analytics;
  return (
    <MockupFrame tabs={["Batches", "Analytics"]} activeTab="Analytics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-4 rounded-xl border border-grey-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">{stat.label}</span>
              <span className={`flex size-8 items-center justify-center rounded ${toneClass[stat.tone]}`}>
                {stat.label === "Total shipments" && <Clock className="size-4" />}
                {stat.label === "Total spend" && <DollarSign className="size-4" />}
                {stat.label === "Active shipment" && <Truck className="size-4" />}
                {stat.label === "Delivered" && <Package className="size-4" />}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-black">{stat.value}</span>
              <span className="text-xs text-grey-500">{stat.hint}</span>
            </div>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}
