import {User} from "lucide-react";
import type {CourierProfile} from "@/types/earnings-types";

interface ProfileCardProps {
  profile: CourierProfile;
}

/** The avatar + name + courier id header on the Account tab. */
export function ProfileCard({profile}: ProfileCardProps) {
  return (
    <section className="rounded-[12px] bg-grey-100 p-1">
      <div className="flex items-center gap-3">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="size-[60px] rounded-full object-cover" />
        ) : (
          <span className="grid size-[60px] place-items-center rounded-full bg-grey-300">
            <User className="size-7 text-grey-500" aria-hidden="true" />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-[18px] leading-[22px] font-bold">{profile.name}</p>
          <p className="text-[14px] font-medium">{profile.courierId}</p>
        </div>
      </div>
    </section>
  );
}
