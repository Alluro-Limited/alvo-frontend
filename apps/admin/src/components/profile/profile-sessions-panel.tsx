import {Laptop, Smartphone} from "lucide-react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminProfile, ProfileSession} from "@/types/profile-types";

interface SessionsPanelProps {
  profile: AdminProfile;
  revoking: boolean;
  onRevoke: (sessionId: string) => void;
}

/** Session tab — every device signed in, with the current one marked and the rest revocable. */
export function ProfileSessionsPanel({profile, revoking, onRevoke}: SessionsPanelProps) {
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <h2 className="text-lg leading-[1.4] font-semibold text-black">{m["profile.sessions_title"]()}</h2>
      <p className="pt-1 pb-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["profile.sessions_subtitle"]()}</p>
      {profile.sessions.map((session) => (
        <SessionRow key={session.id} session={session} revoking={revoking} onRevoke={() => onRevoke(session.id)} />
      ))}
    </section>
  );
}

function SessionRow({session, revoking, onRevoke}: {session: ProfileSession; revoking: boolean; onRevoke: () => void}) {
  const mobile = session.device.toLowerCase().includes("iphone") || session.device.toLowerCase().includes("android");
  const Icon = mobile ? Smartphone : Laptop;
  return (
    <div className="flex items-center justify-between gap-6 border-b border-grey-200 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-grey-100 text-grey-600">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{session.device}</p>
            {session.current && (
              <span className="rounded-full bg-status-success-subtle px-2 py-0.5 text-xs leading-[1.4] font-medium text-status-success-dark">
                {m["profile.session_active"]()}
              </span>
            )}
          </div>
          <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
            {session.location}
            {session.lastActive !== "" && ` · ${session.lastActive}`}
          </p>
        </div>
      </div>
      {!session.current && (
        <Button variant="outline" className="h-9 px-4 text-sm" disabled={revoking} onClick={onRevoke}>
          {m["profile.session_revoke"]()}
        </Button>
      )}
    </div>
  );
}
