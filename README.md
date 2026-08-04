# typescript-monorepo-template

<!--
[![npm version](https://img.shields.io/npm/v/typescript-monorepo-template.svg)](https://www.npmjs.com/package/typescript-monorepo-template)
[![npm downloads](https://img.shields.io/npm/dm/typescript-monorepo-template.svg)](https://www.npmjs.com/package/typescript-monorepo-template)
[![License](https://img.shields.io/npm/l/typescript-monorepo-template.svg)](./LICENSE)
[![codecov](https://codecov.io/gh/noshiro-pf/typescript-monorepo-template/branch/main/graph/badge.svg?token=********)](https://codecov.io/gh/noshiro-pf/typescript-monorepo-template)
 -->

Template Repository for TypeScript Monorepo

## Key Features

- 🛡️ Strict ESLint setup via [eslint-config-typed](https://github.com/noshiro-pf/eslint-config-typed), with `jiti` enabling a TypeScript `eslint.config.mts`.
- 📝 Built-in spelling and formatting checks with cspell / markdownlint / Prettier.
- 🧪 Vitest for unit testing with coverage; workflows included to upload results to [codecov.io](https://about.codecov.io/).
- 🔄 CI runs lint / type-check / test, enforces no post-Prettier diffs, and sends coverage to Codecov.
- 🏗️ `build` generates per-directory `index.mts`, removes unused runtime code with Rollup, and runs type checking.
- 🚀 [Changeset](https://github.com/changesets/changesets) triggers on merges to `main`, handling versioning, changelog updates, npm publish, and GitHub Releases.
- 📚 [TypeDoc](https://typedoc.org/index.html) generates docs.
- 📦 `pnpm` provides strict dependency management (`pnpm-lock.yaml` included).
- 📦 Dependabot auto-creates PRs for npm dependencies and GitHub Actions updates.
- 🔐 [github-settings-as-code](https://github.com/noshiro-pf/github-settings-as-code) tracks repository settings and rulesets as code, detecting changes via diffs.
- 🔄 `AGENTS.md` is shared via submodule to sync operational rules across repositories.

## Local Setup

```sh
git clone https://github.com/{owner}/{repo}.git
pnpm i
```

- Rename the part that says "typescript-monorepo-template".
- Remove `publishConfig` field from `packages/{package}/package.json` if you want to publish to the npm registry.
- Update README.md
- Run `pnpm run check-all` and fix errors if exist.

## GitHub Setup

1. Run `pnpm run repo-settings:apply` to update GitHub Repository Settings.
2. Set Actions secrets on the GUI settings page (<https://github.com/{owner}/{repo}/settings/secrets/actions>).
    - `CHANGESETS_RELEASE_BOT_PRIVATE_KEY`
        - <https://github.com/settings/apps/noshiro-changesets-release-bot> -> App settings -> Generate a private key
        - Required for changeset to open pull requests.
