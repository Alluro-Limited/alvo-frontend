import {ArrowDown, FileText} from "lucide-react";

import {smeFeatureTabsContent} from "@/content/sme";
import {MockupFrame} from "./MockupFrame";

type Cluster = (typeof smeFeatureTabsContent.mockups.batch.clusters)[number];

function BatchPicker({options}: {options: readonly string[]}) {
  return (
    <div className="flex items-start gap-1 rounded-lg border border-grey-300 bg-grey-100/60 p-1">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
            index === 0 ? "bg-primary-500 text-white shadow-sm" : "text-black"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function BatchClusterList({clusters}: {clusters: readonly Cluster[]}) {
  return (
    <div className="flex flex-col gap-2.5">
      {clusters.map((cluster) => {
        const isReview = cluster.status === "Review";
        return (
          <div
            key={cluster.name}
            className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(12,42,33,0.06)]"
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium text-black">{cluster.name}</span>
              <span className="text-xs text-grey-500">{cluster.count}</span>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isReview ? "bg-status-warning-subtle text-status-warning-dark" : "bg-primary-50 text-primary-600"
              }`}
            >
              {cluster.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function BatchMockup() {
  const content = smeFeatureTabsContent.mockups.batch;
  return (
    <MockupFrame tabs={["Upload", "Preview"]} activeTab="Upload">
      <div className="flex flex-col gap-4">
        <BatchPicker options={content.picker} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-primary-500">
            <ArrowDown className="size-3.5" />
            {content.downloadTemplate}
          </button>
          <span className="text-xs text-grey-500">{content.required}</span>
        </div>

        <div className="flex items-center justify-center rounded-lg border border-dashed border-grey-300 bg-grey-100/60 px-4 py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <FileText className="size-5" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-black">{content.fileName}</p>
              <p className="text-xs text-grey-500">{content.fileMeta}</p>
            </div>
          </div>
        </div>

        <BatchClusterList clusters={content.clusters} />
      </div>
    </MockupFrame>
  );
}
