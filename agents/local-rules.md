# Repository Guidelines

In addition to the common instructions above (vendored into `agents/common-rules.md` from the common-agent-config repository), project-specific rules are shown below.

## Dependency updates

`pnpm-update.yml` runs weekly and opens a single bundled pull request that
auto-merges once CI passes. What it holds back lives in `pnpm-workspace.yaml`
(`update.ignoreDeps`, `minimumReleaseAge`) — that is the single source of truth
for it; do not add exclusion arguments to the `update-packages` script.

**GitHub Action pins are updated by `pnpm run update-actions`, not by
`update-packages`.** `update.githubActions` is `false` so that
`update-packages`, which carries `--latest`, leaves the workflow files alone;
`update-actions` turns the check back on with `--include-github-actions` and
deliberately omits `--latest`, so an action only moves within `^current` and a
major waits for a human. Do not set `update.githubActions` back to `true`, and
do not add `--latest` to `update-actions`: `changesets/action` v2 requires
Changesets CLI v3 and renamed every input, so taking that major unattended
breaks `release.yml` on main.

Neither `minimumReleaseAge` nor `update.ignoreDeps` applies to actions. pnpm
resolves action versions from `git ls-remote` refs, which carry a tag name and a
SHA but no publication date, so there is nothing for the age check to read — a
tag hours old is taken regardless. Hold an action back by leaving the major
alone, not by listing it in `ignoreDeps`.
`pnpm outdated --include-github-actions --latest` lists the majors that are
waiting.
