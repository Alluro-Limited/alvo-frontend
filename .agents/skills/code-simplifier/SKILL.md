# code-simplifier

Simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality.

## When to use

- After finishing a feature or bug fix.
- Before committing if the code has grown complex.
- When the user asks to clean up, refactor, or simplify recent changes.

## How to use

1. Focus on recently modified files unless asked otherwise.
2. Preserve all behavior and public APIs.
3. Remove dead code, unused imports, and unnecessary nesting.
4. Use existing abstractions, do not introduce new ones unless clearly needed.
5. Follow the project style guide (Oxfmt, Oxlint, AGENTS.md).
6. Run `bun run lint` and `bun run test:ci` after changes.
