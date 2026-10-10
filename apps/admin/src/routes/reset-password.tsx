import {createFileRoute} from "@tanstack/react-router";
import * as v from "valibot";
import {ResetPasswordPage} from "@/pages/reset-password";
import {m} from "@/paraglide/messages";

// The router may parse an all-digit token as a number, so accept both and keep it a string.
const SearchSchema = v.object({
  token: v.optional(v.pipe(v.union([v.string(), v.number()]), v.transform(String), v.nonEmpty())),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => v.parse(v.fallback(SearchSchema, {}), search),
  head: () => ({meta: [{title: m["reset_password.meta_title"]()}]}),
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  const {token} = Route.useSearch();
  return <ResetPasswordPage token={token} />;
}
