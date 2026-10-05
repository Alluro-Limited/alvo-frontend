import {useIsFetching, useQueryClient} from "@tanstack/react-query";
import {Bell, RefreshCw} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useCurrentUserQuery} from "@/queries/use-current-user-query";

/** Right-hand cluster: refresh (refetches all queries), notifications, and the user avatar. */
export function TopbarActions() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const {data: user} = useCurrentUserQuery();

  return (
    <div className="flex h-10 items-center gap-4">
      <Button
        type="button"
        onClick={() => queryClient.invalidateQueries()}
        startIcon={<RefreshCw aria-hidden="true" className={cn("size-4", isFetching > 0 && "animate-spin")} />}
        className="h-[38px] gap-2 px-3 py-2 text-sm tracking-[0.28px]"
      >
        {m["shell.refresh"]()}
      </Button>
      <button
        type="button"
        aria-label={m["shell.notifications"]()}
        className="flex h-full items-center rounded-lg bg-grey-100 px-2 py-1.5 transition-colors hover:bg-grey-200"
      >
        <span className="relative flex size-6 items-center justify-center">
          <Bell aria-hidden="true" className="size-4 text-primary-850" />
          <span aria-hidden="true" className="absolute top-1 right-1 size-1.5 rounded-full bg-status-fail" />
        </span>
      </button>
      <button
        type="button"
        aria-label={m["shell.account"]()}
        className="flex items-center rounded-lg bg-grey-100 px-2 py-1.5 transition-colors hover:bg-grey-200"
      >
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-grey-300 text-xs leading-[1.4] font-medium tracking-[0.24px] text-[#292929]">
          {user?.name.charAt(0).toUpperCase()}
        </span>
      </button>
    </div>
  );
}
