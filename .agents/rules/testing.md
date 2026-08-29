# Testing rules

- Write deterministic tests: mock network, isolate state, avoid time/race flakiness.
- Co-locate tests in `__tests__/` next to source or as `*.test.tsx`.
- Keep unit/component tests focused; avoid broad integration tests.
- Minimum 80% coverage for all packages and apps.
- Use Playwright CT for `*.ct.tsx`.
- Do not commit console logs or `only`/`skip` in tests.
