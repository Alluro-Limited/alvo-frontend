import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";

/** Error state for a failed assignments fetch, with a retry that re-runs the query. */
export function AssignmentError({onRetry, isRetrying}: {onRetry: () => void; isRetrying: boolean}) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 pt-24">
      <AuthAlert tone="error">
        <span className="flex flex-col">
          <span>{m["assignment.error_title"]()}</span>
          <span>{m["assignment.error_description"]()}</span>
        </span>
      </AuthAlert>
      <Button variant="outline" isLoading={isRetrying} onClick={onRetry} className="self-center">
        {m["assignment.retry"]()}
      </Button>
    </div>
  );
}
