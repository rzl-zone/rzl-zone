# Changelog

## 3.14.1

### Patch Changes

- 5994c67: Update all dependencies and devDependencies
- f7a7255: Add missing `./errors` export path in `package.json`.

## 3.14.1-beta.1 (2026-06-20)

### Patch Changes

- 5994c67: Update all dependencies and devDependencies

## 3.14.1-beta.0 (2026-06-20)

### Patch Changes

- f7a7255: Add missing `./errors` export path in `package.json`.

## 3.14.0 (2026-05-24)

### Minor Changes

- 688282a:
  - Add new `copyText` API in `/operations` and `AbortError` in `/errors`.
  - Improve tsDocs formatting, utility logging, and tests.
  - Refactor internal typings, mark `PreciseType` as internal, and optimize `hasOwnProp` autocomplete performance.

### Patch Changes

- Updated dependencies [688282a]
  - @rzl-zone/node-only@0.0.11

## 3.14.0-beta.0 (2026-05-24)

### Minor Changes

- 688282a:
  - Add new `copyText` API in `/operations` and `AbortError` in `/errors`.
  - Improve tsDocs formatting, utility logging, and tests.
  - Refactor internal typings, mark `PreciseType` as internal, and optimize `hasOwnProp` autocomplete performance.

### Patch Changes

- Updated dependencies [688282a]
  - @rzl-zone/node-only@0.0.11-beta.0

## 3.13.1 (2026-05-20)

### Patch Changes

- Updated dependencies [7e89dbe]
  - @rzl-zone/ts-types-plus@0.1.7

## 3.13.1-beta.0 (2026-05-20)

### Patch Changes

- Updated dependencies [7e89dbe]
  - @rzl-zone/ts-types-plus@0.1.7-beta.0

## 3.13.0 (2026-05-12)

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`.

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`.
- 9f0627e: Update `README` migration notes for NextJS utilities.
- Updated dependencies [c29c9c2]
- Updated dependencies [3a85092]
  - @rzl-zone/node-only@0.0.10
  - @rzl-zone/ts-types-plus@0.1.6

## 3.13.0-beta.3 (2026-05-12)

### Patch Changes

- 9f0627e: Update `README` migration notes for NextJS utilities.

## 3.13.0-beta.2 (2026-05-12)

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`.

## 3.12.1-beta.1 (2026-05-12)

### Patch Changes

- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`.
- Updated dependencies [3a85092]
  - @rzl-zone/ts-types-plus@0.1.6-beta.1

## 3.12.1-beta.0 (2026-05-12)

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- Updated dependencies [c29c9c2]
  - @rzl-zone/node-only@0.0.10-beta.0
  - @rzl-zone/ts-types-plus@0.1.6-beta.0

## 3.12.0 (2026-04-07)

### Features

- **Config:** **Update** `dependencies` and `devDependencies` version also fix some bug.

## 3.11.1 (2026-03-29)

### Bug Fixes

- Fixing `isArray` overload type.

## 3.11.0 (2025-11-10)

### Features

- **`assertIs*`:** Change default `formatCase` to `toKebabCase`, add `useAcronyms` option, and improve TSDoc.
- **`getPreciseType`:** Add `useAcronyms` option, update defaults, internal refactor, and performance improvements.

### Bug Fixes

- **`assertIsArray`:** Ensure correct assertion signature for improved type narrowing.

## 3.10.0 (2025-10-25)

### Chore

- **Config:** Update **_Requirement_** minimum engines (`Node.js` to &gt;=18.18.0).
- **Docs:** Update (`README.md`, `CHANGELOG.md`).

## 3.9.1 (2025-10-22)

### Chore

- Update logo to circle.

## 3.9.0 (2025-10-22)

### Features

- **Enhance:** Utility functions `extractFileName`, `normalizePathname`, `punycodeUtilsJS` and `assertIs*`.

## 3.8.0 (2025-10-17)

### Features

- **randomUUID:** Introduce new `randomUUID` utility, fixing some tsDoc utils, and fixing some minor bugs.

## 3.7.1 (2025-10-16)

### Chore

- **Docs:** Fixing tsDoc example import types from `ClassesValue` to `ClassValues` at `twMergeDefaultV3` and `twMergeDefaultV4`.

## 3.7.0 (2025-10-16)

### Features

- **cx:** Introduce new `cx` utility and revamp class type system.

## 3.6.0 (2025-10-15)

### Features

- Add new utils function `isValidDomain`, `punycodeUtilsJS`, and fixing some bug at `normalizePathname`.
- **normalizePathname:** Introduce `NormalizePathnameOptions` and replace `defaultPath` param.

### Bug Fixes

- Fixing keywords at `package.json`.
- Fixing some bug at utility `isValidDomain` and add extra options `allowPort`, `allowLocalhost`, and `allowProtocol`, also refactor tsDoc at `punycodeUtilsJS` utility.
- Update url docs web at `README.md`.

## 3.5.7 (2025-09-29)

### Chore

- **Docs:** TsDoc `disableUserInteraction` and `enableUserInteraction`.

## 3.5.6 (2025-09-26)

### Chore

- **Docs:** Fixing tsDoc `shouldForwardProp`.

## 3.5.5 (2025-09-26)

### Bug Fixes

- Fix: function `shouldForwardProp`.

## 3.5.4 (2025-09-26)

### Bug Fixes

- **Build:** Fixing `generateReferenceIndex` to disable exporting types at index.d.ts, remove duplicate double `\n` at injectingBanner.
- **Chore:** Update devDeps `@rzl-zone/ts-types-plus` to latest, fixing (build-scripts, eslint-config).
- Fix moving `getPreciseType.utils` to \_private folder for avoid mistake from external, and removing unused or duplicate code at tsup config and change build minify type to terser for browser bundle at tsup config.

## 3.5.3 (2025-09-25)

### Bug Fixes

- **Config:** Fixing exports `typesVersions` at `package.json`.

## 3.5.2 (2025-09-25)

### Bug Fixes

- **Build:** Fixing `generateReferenceIndex`.

## 3.5.1 (2025-09-25)

### Bug Fixes

- **Chore:** Update devDeps `@rzl-zone/ts-types-plus` to latest, fixing (tsup, build-scripts, some MD files, and some configs).

## 3.5.0 (2025-09-20)

### Features

- **Chore:** Update types, dependencies, scripts, tsconfig & README.

## 3.4.0 (2025-09-19)

### Chore

- **Config:** Adding dependencies package **`@rzl-zone/ts-types-plus`** for types-helpers and drop internal types-helper.

## 3.3.1 (2025-09-18)

### Chore

- **Docs:** Fixing `README.md` at docs about hint.

## 3.3.0 (2025-09-18)

### Features

- Add `generate-reference` script and update package.json exports.

## 3.2.0 (2025-09-17)

### Features

- Add new class `CustomPromise`.
- Add new utility type `ExtractStrict`.
- Fixing function `formatPhoneNumber`.
- Move `isServer` from `"@rzl-zone/utils-js/env"` to `"@rzl-zone/utils-js/predicates"`.
- Rename folder structures:
  - `src/formatting` ➔ `src/formatters`.
  - `src/generator` ➔ `src/generators`.
  - `src/promise` ➔ `src/promises`.
- Drop folder structure: `src/env` because empty.
- Fixing almost of functions and type.
- Refactors almost folders `src` structures.
- Fixing `README.md`.
- Fixing `exports` at `package.json`, and fix other configs.

## 3.1.1 (2025-09-11)

### Bug Fixes

- Add extra options **_keepUndefined_** to handling undefined value at `safeStableStringify`.
- Fixing `toStringDeepForce` making support handling like **_Primitives Boxed_** (`new Number`, `new String`, `new Boolean`).
- Fixing tsDoc `toStringDeep` and `toNumberDeep`.

## 3.1.0 (2025-09-11)

### Features

- Add new function `isBooleanObject`, `isStringObject`, `isNumberObject`, `isInfinityNumber`, (with the tests).
- Fixing `toNumberDeep` and `toStringDeep` also narrows type and tests, update all of function which using (`isBooleanObject`, `isStringObject`, `isNumberObject`).
- Update `isDate` will extra options include with tests, and rest fixing tsDoc.

### Bug Fixes

- Fixing `safeStableStringify` enhance more safe for handling NaN, Infinity, -Infinity for boxed primitives (`new Number()`).
- Fixing `toStringDeep` to support handling boolean.
- Fixing to support handling Infinity and -Infinity at `toStringDeep` and fixing `toNumberDeep`.

## 3.0.0 (2025-09-03)

### ⚠ BREAKING CHANGES

- Stable 3.0.0 release, converting the beta version to stable.
- Core API stabilized; all subsequent changes follow semantic versioning.

### Features

- Enhanced `getPreciseType` for full type detection with tests.
- Added extra `tailwind` utilities.
- Added `assertionIs*` function.
- Added `isPropertyKey` function and fixing `doesKeyExist`.
- New overloads for `isArray`, `isObject`, `isObjectOrArray`, `isPlainObject`, `isNonEmptyArray` to support generic types.
- Refactored and improved core utilities like `constructURL`, `formatEnvPort`, `getPrefixPathname`, and `normalizePathname`.
- Improved validation and error messages across multiple functions: `censorEmail`, `createBeApiUrl`, `filterNilArray`, `dedupeArray`, `formatCurrency`, `randomInt`, `randomIntByLength`, `isEmptyObject`, `isEmptyValue`, `isNonEmptyString`, `isNumber`, etc.

### Bug Fixes

- Fixing type and logic issues in `isObject`, `isObjectOrArray`, `deleteNestedKey`, `isArray`.
- Corrected tsDoc comments and error messages in multiple functions.
- Synchronized types and tests for core logic.
- Minor fixes: exported ClassesValue type for Tailwind, updated dev scripts, minification, and CI beta workflow.

## 2.1.0 (2025-08-07)

### Features

- Add new enhance `getPreciseType` function with full type detection and comprehensive tests.

## 2.0.1 (2025-08-07)

### Bug Fixes

- Resolve bug in types return function `isArray`.

## 2.0.0 (2025-08-06)

### ⚠ BREAKING CHANGES

- **Core:** Version 1.0.0 marks the first stable release. This version establishes a consistent and reliable API surface. All breaking changes moving forward will adhere to semantic versioning.

### Features

- Bump 1.1.0.
- **Core:** Initiate stable API.

### Bug Fixes

- Fixing `isObject` generic narrowing types on result logic with custom types, change unknown props as `Extract<string, unknown>` result.
- Fixing `deleteNestedKey` generic types props.
- Fixing `isObject` generic narrowing types on result logic.
- Fixing `isObject` generic narrowing types on result logic with custom types.
- Fixing `isObject` result types generic.
- Fixing `isObject` with internal function `isNil` & `isArray`.
- Fixing `isObjectOrArray` generic narrowing types on result logic with custom types.
- Fixing by adding overload to `isArray` to handle unknown and generic cases.
- Fixing by adding add overload to `isObject` to handle unknown and generic cases.
- Fixing by adding add overloads and ensure correct type guard for `isSet`.
- Fixing correct type guard in `isSafeInteger`.
- Improve `formatDateIntl` type safety and fix optional locale destructuring.
- Improve `isArray` generic narrowing using `Extract<T, unknown[]>`.
- Improve `isNonEmptyArray` generic narrowing using `Extract<T, unknown[]>` and support overload to handle unknown with generic class.
- Improve `isObjectLoose` generic narrowing type.
- Improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class.
- Improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks.
- **Release:** Bump version to `1.0.3`.
- **Release:** Bump version to `1.0.4`.
- Resolve bug in core logic and sync types/tests.

## 1.0.4 (2025-08-06)

### Bug Fixes

- **Release:** Bump version to `1.0.4`.

## 1.0.3 (2025-08-06)

### Bug Fixes

- **Release:** Bump version to `1.0.3`.

## 1.0.2 (2025-08-06)

### Bug Fixes

- Fixing `isObject` generic narrowing types on result logic with custom types, change unknown props as `Record<string, unknown>` result.
- Fixing `deleteNestedKey` generic types props.
- Fixing `isObject` generic narrowing types on result logic.
- Fixing `isObject` generic narrowing types on result logic with custom types.
- Fixing `isObject` with internal function `isNil` & `isArray`.
- Fixing `isObjectOrArray` generic narrowing types on result logic with custom types.
- Improve `formatDateIntl` type safety and fix optional locale destructuring.
- Resolve bug in core logic and sync types/tests.

## 1.0.1 (2025-08-06)

### Bug Fixes

- Fixing `isObject` result types generic.
- Fixing by adding overload to `isArray` to handle unknown and generic cases.
- Fixing by adding overload to `isObject` to handle unknown and generic cases.
- Fixing by adding overloads and ensure correct type guard for `isSet`.
- Fixing correct type guard in `isSafeInteger`.
- Improve `isArray` generic narrowing using `Extract<T, unknown[]>`.
- Improve `isNonEmptyArray` generic narrowing using `Extract<T, unknown[]>` and support overload to handle unknown with generic class.
- Improve `isObjectLoose` generic narrowing type.
- Improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class.
- Improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks.

## 1.0.0 (2025-08-05)

### ⚠ BREAKING CHANGES

- **Core:**
  - Version 1.0.0 marks the first stable release.
  - This version establishes a consistent and reliable API surface.
  - All breaking changes moving forward will adhere to semantic versioning.

### Features

- **Core:** initiate stable API.
