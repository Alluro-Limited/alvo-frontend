# figma-design-to-code

**MANDATORY prerequisite** — invoke this skill before calling `get_design_context` or any Figma MCP tool. Always use it when the user wants to implement, build, port, or code up a Figma design.

## When to use

- The user provides a Figma URL or asks to build a Figma design.
- The user says "implement this Figma design", "build this screen from Figma", "turn this Figma into code", or any similar request.

## Workflow

1. List MCP tools with `mcp_list_tools` on the Figma server.
2. Call `mcp_list_tools` and read the Figma MCP tools first.
3. Use `get_design_context` with the `fileKey` and `nodeId` from the Figma URL.
4. Treat `get_design_context` output as a **reference**, not final code.
5. Map the design to existing project components, tokens, and colors from `@alvo/design-tokens` and `@alvo/ui`.
6. Generate the React + Tailwind implementation and run `bun run lint`.
7. Verify the result matches the reference layout and tokens.
