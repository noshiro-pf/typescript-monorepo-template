# CLAUDE.md

This file is the single, hand-written source of agent instructions for this
repository — edit it directly. The rules below were previously generated from
vendored copies of a shared ruleset; that machinery has been removed, so they
are now maintained here and nowhere else.

This is a pnpm workspace: the packages live under `packages/`, and most
commands at the root fan out to them.

## Commit & Pull Request Guidelines

### Commit Messages

- Use Conventional Commits, for example:
    - `feat: add parser for .mts`
    - `fix: handle Windows path resolution`
    - `chore(deps): bump rollup to 4.50.1`

| prefix   | description                                                                                 |
| :------- | :------------------------------------------------------------------------------------------ |
| feat     | A new feature                                                                               |
| fix      | A bug fix                                                                                   |
| docs     | Documentation-only changes                                                                  |
| style    | Changes that do not affect code behavior (whitespace, formatting, missing semicolons, etc.) |
| refactor | A code change that neither fixes a bug nor adds a feature                                   |
| perf     | A code change that improves performance                                                     |
| test     | Adding missing tests or correcting existing tests                                           |
| chore    | Changes to build process, auxiliary tools, or libraries (e.g., documentation generation)    |

Releases are cut by Changesets from the files under `.changeset/`, not from the
commit messages — add a changeset for any change that should be published.
`lint-pull-request.yml` enforces the same prefixes on pull request titles.

### Pull Requests

- Include a clear description, link related issues, and add screenshots or logs when helpful.
- Note any breaking changes using `BREAKING CHANGE: ...`.
- Make sure CI passes and `pnpm run check-all` completes without errors.

## Essential Development Commands

The root package has no `build`, `test`, `lint`, or `type-check` script of its
own. Each script named `ws:*` runs its unprefixed counterpart in every package
that defines one (`pnpm run --recursive --if-present`), so run the `ws:*` form
from the root and the plain form from inside a package directory.

**Testing:**

- `pnpm run ws:test` — Run Vitest once across the workspace. Inside a package, `test` does the same for that package, with `testw` for watch mode, `test:ui` for the UI, `test:cov` for coverage, and `test:cov:ui` to preview coverage.

**Build:**

- `pnpm run ws:build` — Build every package, in dependency order.
- `pnpm run ws:gi` — Recursively generate `index.mts` files under each package's `src/`.

**Validation:**

- `pnpm run cspell` — Run spell checking (root only; it covers the whole tree).
- `pnpm run ws:type-check` — TypeScript type checking (no emit), against the
  strict standard library. **See "The strict standard library" below.**
- `pnpm run ws:lint` / `pnpm run ws:lint:fix` — Run ESLint check/fix.
- `pnpm run check:root` — Type-check and lint the root's own `scripts/` and `configs/`, which no package covers.
- `pnpm run check-all` — Run all checks (types, lint, tests, markdown, spellcheck).

### The strict standard library

`strict-ts-lib-v7.0` replaces TypeScript's built-in library declarations with
stricter ones — `Number.isFinite` takes a `number` rather than an `unknown`,
`Object.keys` returns the object's own keys rather than `string[]`, and so on.

- **One mechanism: a name.** The root `prepare` script runs the bundle's own
  linker, which writes one symlink per lib group into
  `node_modules/@typescript/`. TypeScript resolves a lib replacement as an
  ordinary package-name lookup once `libReplacement` is on. Do not add an
  `@typescript/lib-*` entry to `paths` — that is a second route to the same
  place, and one that goes stale silently.
- **Type-check with it, publish without it.** `libReplacement` is on in
  `configs/tsconfig/tsconfig.type-check.json` and back off in
  `configs/tsconfig/tsconfig.build.json`, which extends it. A consumer does not
  have these declarations installed, so nothing they receive may depend on
  them.
- **`files` ships `src`, so the source still has to read the same under either
  library.** A consumer resolves types from the emitted `dist/*.d.mts`, but
  `declarationMap` sends "Go to Definition" into the shipped `src`, and what
  they open there is type-checked by their editor against the stock library. A
  construct that only compiles under the strict one turns red for them. Keep
  such assertions in `test/`, which `files` leaves out — the probe below would
  itself fail to compile on their side.
- **`libReplacement` fails silently.** TypeScript falls back to its own
  declarations with no diagnostic if the links go missing. That is what each
  package's `test/strict-lib-active.mts` is for: a `@ts-expect-error` that
  stops compiling — `TS2578` — the moment the replacement stops happening. A
  new package copied from `package-a` should keep it, along with `"./test"` in
  its `tsconfig.json` `include`.

**Formatting:**

- `pnpm run fmt` — Format only uncommitted files.
- `pnpm run fmt:diff` — Format only files changed from `origin/main`.
- `pnpm run fmt:full` — Format all files.

**Document generation:**

- `pnpm run ws:doc` — Generate Markdown documentation into each package's `docs/`.
- `pnpm run ws:doc:embed` — Embed sample code into the Markdown document specified in each package's `scripts/cmd/embed-examples.mts`.

## Project Structure & Module Organization

Packages live under `packages/` (`package-a`, `package-b`). Each one is
self-contained and holds its own source, config, build output, and generated
docs:

- Source: `packages/<name>/src`
    - `**/index.mts` — Module entry points, generated by `gi`.
- Tests: Vitest, `*.test.mts`, beside the source files they cover. Coverage output in `packages/<name>/coverage/`.
- Build output: `packages/<name>/dist/` (ES modules `.mjs`, type definitions `.d.mts`).
- Config: `packages/<name>/configs/` (TypeScript, Vitest, Rollup, Typedoc), plus that package's `eslint.config.mts` and `tsconfig.json`.
- Generated API docs: `packages/<name>/docs/`, generated by Typedoc.

At the root:

- Config: `configs/` (shared TypeScript and tool config the packages extend), root linter and tool configs.
- Scripts: `scripts/` (Node `tsx` helpers for workspace-wide checks and build staging).
- Docs: `docs/` — hand-written setup guides, not generated.
- Changesets: `.changeset/` — one file per change that should be published.
- GitHub repository settings: `github/`

## Important Instructions

- After making code changes, run `pnpm run fmt`, then check for type errors with `pnpm run ws:tsc` and lint errors with `pnpm run ws:lint:fix` if you changed TypeScript/JavaScript code. Fix any errors found. If you changed anything under the root `scripts/` or `configs/`, run `pnpm run check:root` as well.
    - Do not use file-level `/* eslint-disable */` or turn off rules in `eslint.config.mts` to fix lint errors.
    - Avoid using `// eslint-disable-next-line` whenever possible.
- **RESTRICTIONS**: Do not perform these actions without explicit user instructions:
    - Push to GitHub or remote repositories
    - Access `~/.ssh` or other sensitive directories

## Testing Guidelines

### Framework and Setup

- Framework: Vitest with globals enabled.
- Place unit tests beside the source files they cover, inside that package's `src/`, using `*.test.mts`.
- Maintain meaningful coverage; exclude simple re-export files.
- Run tests locally with `pnpm run ws:test` during development, or `pnpm run test` from inside a package.
- `vitest/globals` are enabled. Do not import `test`, `expect`, `assert`, or `describe` explicitly.

### Test-Driven Development (TDD)

When implementing new features, follow this TDD workflow:

1. **Write tests first**: Create tests based on expected inputs and outputs.
2. **Verify test failure**: Run tests to confirm they fail as expected.
3. **Implement code**: Write the minimal code needed to make tests pass.
4. **Refactor**: Improve code while keeping tests green.
5. **Repeat**: Continue the cycle for additional functionality.

**Important**: During implementation, avoid modifying tests unless requirements change.

### Testing Approach

This project uses **Vitest** with a dual testing strategy:

1. **Compile-time type testing** via the `expectType` utility.
2. **Runtime behavioral testing** with standard assertions.

Example pattern:

```typescript
import { expectType } from '../expect-type.mjs';

// Type-level assertion
expectType<typeof result, readonly [0, 0, 0]>('=');
// Runtime assertion
assert.deepStrictEqual(result, [0, 0, 0]);
```

The `expectType` utility provides a DSL for type assertions:

- `"="`: Exact type equality
- `"~="`: Mutual extension (A extends B and B extends A)
- `"<="`: A extends B
- `">="`: B extends A
- `"!="`, `"!<="`, `"!>="`: Negated versions

Use `expectType<A, B>('=')` whenever possible. Avoid using `expectType<A, B>('<=')` or `expectType<A, B>('!=')` except when intended.

### Test Code Conventions

- Unify `test` names, `describe` nesting, and `expect` placement with Vitest/Jest/Playwright/Cypress rules.
- Use `assert.deepStrictEqual(A, B)` instead of `assert.deepEqual(A, B)`, `expect(A).toEqual(B)`, or `expect(A).toStrictEqual(B)` in Vitest tests (enforced by `vitest-coding-style/no-expect-to-strict-equal`).
- Use `test()` instead of `it()` in Vitest tests.
- Avoid overusing `await` for synchronous events and avoid `force`/`pause`; prefer screen API and user interaction simulation.

## Coding Style & Naming Conventions

### Important Patterns

- **Immutability**: Functions return immutable data structures
- **Type Safety**: Leverage `ts-type-forge` for advanced TypeScript patterns
- **Type Guards**: Prefer type guard functions over type assertions
- **Import Strategy**:
    - Import `.mts` with extensions `.mjs`.
    - Use relative paths within `src/`; avoid importing from generated `dist/` and `index.mjs` directly.
- **Export Strategy**:
    - All exports go through generated `index.mts` files
    - Modules should use named exports, default exports are only allowed for configuration.
- **Documentation**: Auto-generated from TSDoc comments using TypeDoc
- **File Naming**:
    - `camelCase` for variables/functions, `PascalCase` for types/classes, `kebab-case` for file names.
    - Language: TypeScript ESM; prefer `.mts` for modules and `.d.mts` for types. Compiled output is `.mjs`.
- **Formatting**:
    - Follow the repository’s Prettier setup with organize-imports and package.json plugins—avoid manual formatting.
        - Indentation: 2 spaces; LF endings. Markdown uses 4-space indents (see `.editorconfig`).

#### Why enforce readonly?

```ts
// ❌
const t: [string, number] = ['a', 1];

function f(x: number) {
    if (typeof x !== 'number') throw new Error('Error!!');
}

t.reverse(); // [1, 'a']

f(t[1]); // "Error!!" (but no type errors)
```

In this example, we reverse a mutable tuple `t` and pass it to `f`. `reverse` is a destructive method, and after applying it, the content of `t` becomes `[1, 'a']`, but TypeScript's type system keeps `t`'s type as `[string, number]`. This creates an inconsistency where `t[1]` is type `number` in TypeScript but `string` at runtime, causing a runtime error when calling `f`.

If we annotate it as readonly as shown below, the destructive method `reverse` cannot be called on the readonly tuple `t`. Instead, we must call the non-destructive method `toReversed`, which is inferred as type `(string | number)[]`, causing a type error: "`string | number` is not assignable to parameter of type `number`".

```ts
// ✅
const t: readonly [string, number] = ['a', 1];

function f(x: number) {
    if (typeof x !== 'number') throw new Error('Error!!');
}

const r = t.toReversed(); // (string | number)[]

f(r[1]);
// Argument of type 'string | number' is not assignable to parameter of type 'number'.
```

Beyond this, treating most variables as immutable improves code readability and prevents various issues, such as mutating objects without changing their references in React rendering (which can cause UI not to update), enhancing overall robustness.

See also: [TypeScript Issue #52375](https://github.com/microsoft/TypeScript/issues/52375)

### Script Organization Rules

Within a file, organize code in the following order:

1. **main function** - entry point at the top
2. **exported functions and definitions** - public API surface
3. **type definitions** - types used by the above functions
4. **constants and settings** - configuration values
5. **helper functions** - organized by call hierarchy level (ascending order: lower-level helpers before higher-level ones)
6. **utility functions** - lowest-level utilities

This organization makes the script easier to read and understand the execution flow.

### TypeScript/React File Organization

When implementing functions or React components in TypeScript:

- Place exported functions/components immediately after import statements at the top of the file
- Organize code in a top-down manner so that the reading direction (top to bottom) matches the direction of tracing definitions
- This allows readers to understand the main logic first, then follow implementation details naturally as they read downward

#### React Component File Structure

For React component files, follow this specific order:

1. **Import statements**
2. **Type Props definition** (e.g., `type Props = { ... }`)
3. **Exported React component**
4. **displayName assignment** (if the component is memoized)
5. **Other definitions** (styles, helper functions, constants, etc.)

Additionally:

- **One component per file** as a general principle
- Each component file should focus on a single component to maintain clarity and modularity

### Syntax rules (and corresponding ESLint rules)

- Type safety first
    - **NEVER** use `as any`, `as never`, or `@ts-ignore` (use `@ts-expect-error` when absolutely necessary)
    - Explicitly specify function return types (checked by `@typescript-eslint/explicit-function-return-type` rule)
        - Explicit return types do make it visually more clear what type is returned by a function. They can also speed up TypeScript type checking performance in large codebases with many large functions.
    - Avoid dangerous type assertions with `any` or `never`.
    - Avoid any casting as possible.
    - Use readonly properties and parameters by default. Follow lint configuration for type definition notation.
    - Avoid implicit type coercion
        - Do not use non-boolean values in conditions of if/while statements or as operands of logical operators (checked by `@typescript-eslint/strict-boolean-expressions` rule).
        - Do not embed variables of types other than number, string, or boolean in template literals (checked by `@typescript-eslint/restrict-template-expressions` rule).
    - Always provide a comparison function when sorting arrays. Exception: may be omitted only for string arrays (`string[]`) (checked by `require-array-sort-compare` rule).
    - Prohibit operations that easily produce exceptions such as partial `reduce` or division
- Operator usage restrictions
    - Prohibit `+foo` (coercion to number) or `"" + foo` (coercion to string) (checked by `no-implicit-coercion` rule).
    - Prohibit addition of different types like `"1" + 2` (checked by `@typescript-eslint/restrict-plus-operands` rule).
    - Do not use `+` for string concatenation (checked by `prefer-template` rule). Instead, follow these patterns:
        - For a few strings: use template literals (e.g., `${a}_${b}`)
        - For many strings or dynamic lists: use array `.join()` or `.concat()` (e.g., `["aaa", "bbb", "ccc", ..., "zzz"].join("\n")`)
        - For source code generation: consider using `dedent` for cleaner formatting
- Immutable data orientation
    - Use `const` instead of `let` (`functional/no-let`).
        - If you absolutely must use it, add the `mut_` prefix to the variable name.
    - Enforce readonly types.
        - Always use `readonly T[]` instead of `T[]` for arrays.
        - When nesting is deep and writing `Readonly<*>` becomes verbose, consider using `DeepReadonly` type utility like `DeepReadonly<{ a: { b: { c: number[] }}}>`.
    - Define object and array constants with `as const`.
    - Prohibit direct mutation of objects and avoid making arguments or return values mutable (checked by `functional/immutable-data` rule).
    - Eliminate mutable/partial structures like class inheritance and enums in principle.
- Enforce modern syntax
    - Do not use legacy syntax such as `var`, `new Array()`, `in` operator, or `React.useImperativeHandle`.
    - Prefer template literals, object spread, and `Object.hasOwn`
    - Use arrow functions in all cases
- Module and dependency management
    - Use ES modules (import/export) syntax over CommonJS (require)
    - Use named exports unless restricted by libraries or frameworks
    - Destructuring imports when possible (e.g., `import { foo } from 'bar'`)
        - Exceptions: Node utilities such as fs, path, url etc.
    - Avoid circular imports (`import-x/no-cycle`).
    - Use explicit type-imports and do not add extensions except for `.mjs`/`.json`.
    - Do not use internal path imports like `./a/b`. Place index.mts files in each directory and export items to be referenced by other directories. Use `pnpm run gi` command to auto-generate index.mts files for all directories.
    - Write code that is tree-shakeable
    - Use standard modules with `node:` prefix
- Robust async handling
    - Always use `await` or `.catch()` with Promises, eliminating nesting and multiple resolutions (checked by `no-floating-promises` rule).
- React/JSX rules
    - Define components with arrow functions + `.tsx` extension.
    - Avoid props spread and inline functions/objects.
    - Strictly manage Hooks dependency arrays and call order, preventing unnecessary re-renders and improper exports with React Refresh/Perf rules.
    - In JSX conditionals, do not use short-circuit evaluation like `cond && <Something />`, instead use ternary operators for strict branching: `cond ? <Something /> : undefined` (checked by `react/jsx-no-leaked-render`).
    - Do not concatenate strings by placing multiple expressions adjacently in JSX (e.g., `<div>{x}{y}</div>`). Instead, use template literals: `<div>{`${x}${y}`}</div>`.
- Accessibility enforcement
    - Provide roles and labels for all interactive elements. Follow JSX a11y rules for consistent `alt` and `aria-*` attributes, focus management, and tabindex control.
- Security and quality
    - Prohibit `eval`, `Function`, dynamic `require`, `import`, and dangerous regular expressions.
    - Enforce file naming, array operations, and modern DOM/Node API adoption with `unicorn/*`, improve readability and reduce bugs with `import-x/no-useless-path-segments` and `no-restricted-globals`.

### React Coding Style

TBD

## Troubleshooting

### Type Errors

#### `noUncheckedIndexedAccess` Related Issues

This project uses TypeScript with the strict setting noUncheckedIndexedAccess: true , so the following code will result in a type error:

```ts
// ❌
const xs: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

if (xs.length > 0) {
    console.log(xs[0] * 2);
    //          ~~~~~
    //          Object is possibly 'undefined'.
}
```

This error can be resolved as follows:

```ts
// ✅
import { Arr } from 'ts-data-forge';

const xs: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

if (Arr.isNonEmpty(xs)) {
    console.log(xs[0] * 2);
}
```

`isNonEmpty` is defined as follows:

```ts
type NonEmptyArray<A> = readonly [A, ...(readonly A[])];

const isNonEmpty = <E>(array: readonly E[]): array is NonEmptyArray<E> =>
    array.length > 0;
```

##### Early Return

```ts
// ❌
const fn = (xs: readonly number[]): void => {
    if (xs.length === 0) {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const first: number = xs[0]!;

    // ...
};
```

```ts
// ✅
const fn = (xs: readonly number[]): void => {
    if (!Arr.isNonEmpty(xs)) {
        return;
    }

    const first: number = xs[0];

    // ...
};
```

### Lint Errors

#### total-functions/no-partial-division

To avoid division by zero errors, always use `Num.div` from `ts-data-forge` and explicitly check for zero before dividing:

```ts
// ❌ Don't do this:
const result = a / b; // Error: Division is partial

// ❌ Don't create your own utility like this:
const safeDivide = (a: number, b: number): number =>
    // eslint-disable-next-line total-functions/no-partial-division
    b === 0 ? 0 : a / b;
```

```ts
// ✅ Do this:
import { Num } from 'ts-data-forge';

const calculateValue = (a: number, b: number): number => {
    if (!Num.isNonZero(b)) return 0;
    return Num.div(a, b);
};
```

Note: `Num.div` requires the denominator to be of type `NonZeroNumber | 1 | 2 | ... | 39 | -1 | -2 | ... | -40` for compile-time safety, so you must check for zero before calling it.

#### functional/immutable-data / functional/no-let

This disables mutation and encourages functional programming, but if you absolutely need to use mutable variables, you can avoid errors by adding the `mut_` prefix to the variable name.

```ts
// ❌

// eslint-disable-next-line functional/no-let
let temp = 0;

temp = 2;

const xs: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// eslint-disable-next-line functional/immutable-data
xs[0] = 100;
```

```ts
// ✅

let mut_temp = 0;

mut_temp = 2;

const mut_xs: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

mut_xs[0] = 100;
```

#### vitest/no-conditional-expect

```ts
expect(Result.isErr(result)).toBe(true);

if (Result.isErr(result)) {
    // error  Avoid calling `expect` inside conditional statements  vitest/no-conditional-expect
    assert.deepStrictEqual(result.value, { data: [] });
}
```

You can write it like this using the `assert` function, which narrows down the types:

```ts
assert.isTrue(Result.isErr(result));

assert.deepStrictEqual(result.value, { data: [] });
```

#### functional/immutable-data

NG:

```ts
// error  Modifying an existing object/array is not allowed  functional/immutable-data
temp.value = 'new value';
```

OK:

```ts
mut_temp.value = 'new value';
```

## About Libraries

### ts-type-forge

Types such as `DeepReadonly`, `StrictOmit`, `ReadonlyRecord` etc. are installed globally via `global.d.mts` provided by `ts-type-forge`. There is no need to explicitly import types from `ts-type-forge`.

### ts-data-forge

- Use `Arr.isArray` instead of `Array.isArray` (enforced by `ts-data-forge/prefer-arr-is-array` rule from <https://github.com/noshiro-pf/eslint-config-typed.git>)
- Use `isRecord` and `hasKey` for type narrowing instead of `Object.hasOwn` or `in` operator (enforced by `ts-data-forge/prefer-is-record-and-has-key` rule)
- Arguments for functions like `Arr.seq` must be of type `Int` (cast using `asUint32` utility)
- Use `memoizeFunction` for function memoization
- Use `fastDeepEqual` for deep equality comparison
- Unit test
    - Write `assert.isTrue(Result.isErr(result))` instead of `expect(Result.isErr(result)).toBe(true)`

### immer

- When assigning readonly values to immer's draft causes type errors, use `castDraft` to resolve them

---

## Repository Guidelines

In addition to the general instructions above, the project-specific rules for this repository are shown below.

### Dependency updates

`pnpm-update.yml` runs daily and opens a single bundled pull request that
auto-merges once CI passes. It rebuilds `chore/pnpm-update` from main on every
run, so there is only ever one open and it is always rebased onto main. What it
holds back lives in `pnpm-workspace.yaml` (`update.ignoreDeps`,
`minimumReleaseAge`) — that is the single source of truth for it; do not add
exclusion arguments to the `update-packages` script.

**GitHub Action pins are updated by `pnpm run update-actions`, not by
`update-packages`.** `update.githubActions` is `false` so that
`update-packages`, which carries `--latest`, leaves the workflow files alone;
`update-actions` turns the check back on with `--include-github-actions` and
deliberately omits `--latest`, so an action only moves within `^current` and a
major waits for a human. Do not set `update.githubActions` back to `true`, and
do not add `--latest` to `update-actions`: `changesets/action` renamed every
input at v2, so taking that major unattended leaves `release.yml` passing the
old names and breaks the release on main.

**`changesets/action` and `@changesets/cli` majors move together.** The action
learns what `changeset publish` actually published from the CLI, and the two
majors disagree about how: v1 scrapes `New tag: <pkg>@<version>` lines out of
the publish script's stdout, while v2 reads a file the CLI writes at the path in
`CHANGESETS_OUTPUT`. Only CLI v2 prints that line; only CLI v3 writes that file.
Pair them the wrong way and nothing fails loudly — `changeset publish` still
pushes the packages to the registry, and the action simply finds nothing to tag,
so the git tags and the GitHub Releases are skipped without a diagnostic and the
job stays green. `update-packages` moves the CLI while `update-actions` moves
the action, so nothing links the two; check the other side by hand whenever
either major changes. This is not hypothetical: `@noshiro-pf/package-a@1.0.2`
and `@noshiro-pf/package-b@0.1.1` reached GitHub Packages with no tag and no
release because the CLI reached v3 while the action was still pinned to v1.

Neither `minimumReleaseAge` nor `update.ignoreDeps` applies to actions. pnpm
resolves action versions from `git ls-remote` refs, which carry a tag name and a
SHA but no publication date, so there is nothing for the age check to read — a
tag hours old is taken regardless. Hold an action back by leaving the major
alone, not by listing it in `ignoreDeps`.
`pnpm outdated --include-github-actions --latest` lists the majors that are
waiting.
