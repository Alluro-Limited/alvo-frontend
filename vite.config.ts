import {defineConfig} from "vite-plus";

export default defineConfig({
  test: {
    projects: ["apps/*", "packages/*"],
  },
  fmt: {
    printWidth: 140,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    arrowParens: "always",
    bracketSpacing: false,
    bracketSameLine: false,
    endOfLine: "lf",
    ignorePatterns: ["*.gen.ts", "**/src/paraglide/**", "**/coverage/**"],
  },
  lint: {
    plugins: ["react", "react-perf", "typescript", "jsx-a11y"],
    categories: {
      correctness: "error",
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/prefer-tag-over-role": "off",
      "react/exhaustive-deps": "off",
      "typescript/no-explicit-any": "warn",
      "typescript/no-restricted-types": [
        "error",
        {types: {unknown: "Use explicit domain types or UntrustedValue/UntrustedRecord at untrusted boundaries."}},
      ],
      "eslint/complexity": ["error", {max: 10}],
      "eslint/max-lines-per-function": ["error", {max: 50, skipComments: true}],
      "eslint/max-lines": ["error", {max: 250, skipBlankLines: true, skipComments: true}],
      "eslint/max-params": ["error", 3],
      "eslint/max-depth": ["error", 3],
      "eslint/max-statements": ["error", 25],
      "eslint/max-classes-per-file": ["error", 1],
      "oxc/branches-sharing-code": "warn",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    ignorePatterns: [
      "*.html",
      "docker",
      "public",
      "__tests__",
      "*.test.ts",
      "*.test.tsx",
      "*.spec.ts",
      "*.spec.tsx",
      "*.ct.tsx",
      "*.gen.ts",
      "*.d.ts",
      "**/src/paraglide/**",
      "**/coverage/**",
      "dist",
      "node_modules",
      "apps/*/dist",
      "apps/*/node_modules",
      "apps/*/.source",
      "**/.source",
      "packages/*/dist",
      "packages/*/node_modules",
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  staged: {
    // vp check = format + lint + typecheck. The rest keeps what the previous
    // lefthook pre-commit ran on staged files: related tests, react-doctor and
    // Playwright CT. (String tasks get the staged files appended; the
    // react-doctor fn ignores them and uses its own git scope.)
    "*.{js,ts,jsx,tsx}": ["vp check --fix", "vp test related --run --reporter=verbose --bail=1 --passWithNoTests"],
    "*.{jsx,tsx}": () => "react-doctor --scope changed",
    "*.ct.tsx": "playwright test -c playwright-ct.config.ts",
    "*.{json,md,yaml,yml,css}": "vp fmt --write",
  },
});
