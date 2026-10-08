import {CalendarDays, Clock3} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {AdminProfile} from "@/types/profile-types";
import {CourierAvatar} from "@/components/couriers/courier-avatar";
import {AdminRolePill, AdminStatusPill} from "@/components/admins/admin-pills";

/** The profile identity card above the tab panels — avatar, name, pills, member-since/last-login meta. */
export function ProfileHeaderCard({profile}: {profile: AdminProfile}) {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white px-6 py-5">
      <div className="flex items-center gap-4">
        <CourierAvatar id={profile.id} name={`${profile.firstName} ${profile.lastName}`} photoUrl={null} size="size-14" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg leading-[1.4] font-semibold text-black">{`${profile.firstName} ${profile.lastName}`}</h2>
            <AdminRolePill role={profile.role} />
            <AdminStatusPill status={profile.status} />
          </div>
          <p className="pt-0.5 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{profile.email}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {m["profile.member_since"]()}: {profile.memberSince}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-3.5" aria-hidden="true" />
          {m["profile.last_login"]()}: {profile.lastLogin}
        </span>
      </div>
    </section>
  );
}
