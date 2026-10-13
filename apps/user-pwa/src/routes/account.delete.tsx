import {createFileRoute} from "@tanstack/react-router";
import {DeleteAccountPage} from "@/pages/delete-account";

export const Route = createFileRoute("/account/delete")({
  component: DeleteAccountPage,
});
