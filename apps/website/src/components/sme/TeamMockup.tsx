import {smeFeatureTabsContent} from "@/content/sme";
import {MockupFrame} from "./MockupFrame";

export function TeamMockup() {
  const content = smeFeatureTabsContent.mockups.team;
  return (
    <MockupFrame tabs={["Wallet", "Invoice"]} activeTab="Wallet">
      <div className="flex flex-col gap-2.5">
        {content.members.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(12,42,33,0.06)]"
          >
            <span className="size-[18px] rounded-full bg-primary-500" />
            <span className="flex-1 text-sm font-medium text-black">{member.name}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                member.tone === "warning" ? "bg-status-warning-subtle text-status-warning-dark" : "bg-primary-50 text-primary-600"
              }`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}
