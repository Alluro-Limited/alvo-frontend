import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";

/** Full-page error state for a failed fetch, with a retry that re-runs the query. */
export function PageError({onRetry, isRetrying}: {onRetry: () => void; isRetrying: boolean}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 pt-24">
      <AuthAlert tone="error">
        <span className="flex flex-col">
          <span>{m["errors.load_title"]()}</span>
          <span>{m["errors.load_desc"]()}</span>
        </span>
      </AuthAlert>
      <Button variant="outline" isLoading={isRetrying} onClick={onRetry} className="self-center">
        {m["errors.retry"]()}
      </Button>
    </div>
  );
}
