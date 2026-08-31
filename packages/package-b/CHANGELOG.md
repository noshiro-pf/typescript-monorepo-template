# @noshiro-pf/package-b

## 0.1.2

### Patch Changes

- 6e631a8: Re-cut both packages through the repaired release pipeline.

    No source changed. `1.0.2` / `0.1.1` reached GitHub Packages but received no git
    tag and no GitHub Release: `changesets/action` was pinned to v1, which learns
    what was published by scraping `New tag: <pkg>@<version>` lines out of the
    publish script's stdout, and `@changesets/cli` stopped printing that line at v3.
    The action is now on v2, which instead reads the file the CLI writes at the path
    in `CHANGESETS_OUTPUT`, so this is the first version to be tagged and released
    as well as published.

## 0.1.1

### Patch Changes

- 1d7db08: Publish the type declarations the manifests already pointed at.

    `exports["."].import.types`, `types` and `module` all named files the build
    never produced: nothing emitted declarations, and the generated
    `dist/types.d.mts` re-exported an entry point that does not exist here. A
    consumer installing either package received JavaScript and no types at all.

    `build` now runs `tsc --emitDeclarationOnly` after rollup, and the three
    manifest fields name files that exist.
