import {UserRoundPlus} from "lucide-react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";

/** Page header — title plus the Invite Admin CTA that opens the invite drawer. */
export function AdminsHeader({onInvite}: {onInvite: () => void}) {
  return (
    <header className="mb-4 flex items-start justify-between">
      <h1 className="text-2xl leading-[1.3] font-bold text-black">{m["admins.title"]()}</h1>
      <Button onClick={onInvite} className="gap-2">
        <UserRoundPlus className="size-4" aria-hidden="true" />
        {m["admins.invite"]()}
      </Button>
    </header>
  );
}
