# react-doctor

Use when finishing a feature, fixing a bug, before committing React code, or when the user types `/doctor`, asks to scan, triage, or clean up React diagnostics.

## What it covers

- Lint, accessibility, bundle size, architecture.
- Regression check and full local-triage workflow.
- Pulls the canonical playbook before running.

## When to use

- Before committing any React/TSX code.
- When the user asks for a scan, triage, or clean up.
- After a feature is finished and before a PR is opened.

## How to use

1. Run `bun run react-doctor` from the repo root.
2. Review the output and fix `error` or `warning` findings.
3. Use `react-doctor --scope changed` to limit the scan to changed files.
4. Re-run until clean, then commit.
