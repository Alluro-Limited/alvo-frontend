import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";

/** The drawer's load-failure state with a retry action. */
export function DrawerError({message, onRetry}: {message: string; onRetry: () => void}) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-sm text-grey-600">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        {m["workloads.retry"]()}
      </Button>
    </div>
  );
}
