import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useProfileOptionsQuery, useProfileQuery} from "@/queries/use-profile-queries";
import {ProfileLoaded} from "@/components/profile/profile-loaded";

/** System → Profile — identity card plus the Personal Info / Security / Notification / Session tabs. */
export function ProfilePage() {
  const profile = useProfileQuery();
  const options = useProfileOptionsQuery();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl leading-[1.3] font-bold text-black">{m["profile.title"]()}</h1>
      {profile.isPending && <ProfileSkeleton />}
      {profile.isError && <ProfileError retrying={profile.isRefetching} onRetry={() => void profile.refetch()} />}
      {profile.data && <ProfileLoaded profile={profile.data} options={options.data} />}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="h-24 animate-pulse rounded-2xl border border-grey-200 bg-grey-100" />
      <div className="flex items-start gap-6">
        <div className="flex w-[245px] flex-col gap-2">
          {Array.from({length: 4}, (_, index) => (
            <div key={index} className="h-11 animate-pulse rounded-lg bg-grey-100" />
          ))}
        </div>
        <div className="h-[420px] w-[651px] animate-pulse rounded-2xl border border-grey-200 bg-grey-100" />
      </div>
    </div>
  );
}

function ProfileError({retrying, onRetry}: {retrying: boolean; onRetry: () => void}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-grey-300 bg-white py-20"
      data-testid="profile-error"
    >
      <p className="text-sm font-medium text-black">{m["profile.error_title"]()}</p>
      <Button variant="outline" isLoading={retrying} onClick={onRetry} className="h-9 px-4">
        {m["profile.retry"]()}
      </Button>
    </div>
  );
}
