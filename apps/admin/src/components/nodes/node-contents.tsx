import {Package, Vault} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {NodeContentItem} from "@/types/nodes-types";
import {formatSinceAgo} from "./nodes-format";

/** The current contents card — parcels and safe items sitting in the node right now. */
export function NodeContents({items, now}: {items: NodeContentItem[]; now?: number}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-grey-200 bg-white p-6" aria-labelledby="node-contents-title">
      <h2 id="node-contents-title" className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">
        {m["nodes.contents_title"]({count: items.length})}
      </h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-8 text-center">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.contents_empty_title"]()}</p>
          <p className="max-w-[360px] text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["nodes.contents_empty_description"]()}</p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => {
            const Icon = item.kind === "safe" ? Vault : Package;
            return (
              <li key={item.id} className="flex items-center gap-3 border-b border-grey-100 py-3 last:border-b-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-grey-100 text-grey-600">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">
                    {item.id} · {item.owner}
                  </p>
                  <p className="truncate text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
                    {item.slot} · {m["nodes.content_since"]({since: formatSinceAgo(item.sinceAt, now)})}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-primary-50 px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-700">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
