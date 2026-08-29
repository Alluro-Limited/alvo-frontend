# gh-stack

Manage stacked branches and pull requests with the `gh-stack` GitHub CLI extension. Use when the user wants to create, push, rebase, sync, navigate, or view stacks of dependent PRs.

## When to use

- The user wants stacked diffs, dependent pull requests, branch chains, or incremental code review workflows.

## Common commands

- `gh stack create` — create a new stack.
- `gh stack push` — push the current stack.
- `gh stack rebase` — rebase the stack.
- `gh stack sync` — sync the stack with the base branch.
- `gh stack view` — view the stack status.

## Rules

- Do not rewrite history on shared branches.
- Always use `gh` for GitHub operations.
- Keep each PR in the stack scoped to one logical change.
