import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";

/** Full-page error state for a failed workloads fetch, with a retry that re-runs the query. */
export function WorkloadsError({onRetry, isRetrying}: {onRetry: () => void; isRetrying: boolean}) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 pt-24">
      <AuthAlert tone="error">
        <span className="flex flex-col">
          <span>{m["workloads.load_error_title"]()}</span>
          <span>{m["workloads.load_error_description"]()}</span>
        </span>
      </AuthAlert>
      <Button variant="outline" isLoading={isRetrying} onClick={onRetry} className="self-center">
        {m["workloads.retry"]()}
      </Button>
    </div>
  );
}
