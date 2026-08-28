# @noshiro-pf/package-b

## 0.1.1

### Patch Changes

- 1d7db08: Publish the type declarations the manifests already pointed at.

    `exports["."].import.types`, `types` and `module` all named files the build
    never produced: nothing emitted declarations, and the generated
    `dist/types.d.mts` re-exported an entry point that does not exist here. A
    consumer installing either package received JavaScript and no types at all.

    `build` now runs `tsc --emitDeclarationOnly` after rollup, and the three
    manifest fields name files that exist.
