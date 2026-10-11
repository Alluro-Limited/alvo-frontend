import {Menu, MenuItem, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger} from "@alvo/ui";
import {useNavigate} from "@tanstack/react-router";
import {EllipsisVertical} from "lucide-react";
import {m} from "@/paraglide/messages";
import {downloadTextFile} from "@/lib/download-text-file";
import type {BatchSummary} from "@/types/batch-types";

/** The ⋮ row menu: open the batch or download its labels. */
export function BatchRowMenu({batch}: {batch: BatchSummary}) {
  const navigate = useNavigate();
  return (
    <Menu>
      <MenuTrigger
        aria-label={m["batches.row_actions"]({name: batch.name})}
        className="flex size-8 items-center justify-center rounded border-[0.75px] border-grey-300 bg-white"
      >
        <EllipsisVertical className="size-4 text-grey-600" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner side="bottom" align="end" sideOffset={4}>
          <MenuPopup className="min-w-[143px] rounded p-0">
            <MenuItem
              className="h-10 rounded-none px-4 text-sm text-black"
              onClick={() => void navigate({to: "/shipments/$batchId", params: {batchId: batch.id}})}
            >
              {m["batches.view_details"]()}
            </MenuItem>
            <MenuItem
              className="h-10 rounded-none border-t-[0.5px] border-grey-200 px-4 text-sm text-black"
              onClick={() => downloadTextFile(`${batch.id}-labels.txt`, `${batch.name} (${batch.id})\n`)}
            >
              {m["batches.download_label"]()}
            </MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
