---
'@noshiro-pf/package-a': patch
'@noshiro-pf/package-b': patch
---

Re-cut both packages through the repaired release pipeline.

No source changed. `1.0.2` / `0.1.1` reached GitHub Packages but received no git
tag and no GitHub Release: `changesets/action` was pinned to v1, which learns
what was published by scraping `New tag: <pkg>@<version>` lines out of the
publish script's stdout, and `@changesets/cli` stopped printing that line at v3.
The action is now on v2, which instead reads the file the CLI writes at the path
in `CHANGESETS_OUTPUT`, so this is the first version to be tagged and released
as well as published.
