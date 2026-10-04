# @alvo/admin

Internal operations console, served at `admin.allurro.com`.

## Quick start

```sh
bun install                      # from the repo root; also compiles Paraglide messages
cp apps/admin/.env.example apps/admin/.env.local
bun run dev:admin
```

## Scripts

- `bun run dev` / `bun run build` / `bun run preview`
- `bun run test` / `bun run test:coverage` (80% minimum)
- `bun run i18n:compile` — regenerate `src/paraglide` from `messages/*.json`
- `bun run machine-translate` — translate new keys once locales are added

## Deployment

Vercel project with Root Directory `apps/admin`; build settings come from `vercel.json`.
Set `VITE_API_URL` and `VITE_SENTRY_DSN` per environment, plus `SENTRY_AUTH_TOKEN`,
`SENTRY_ORG` and `SENTRY_PROJECT` in Production to upload source maps.
See `docs/architectural-guidelines.md` §15.
