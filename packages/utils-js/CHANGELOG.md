# Changelog

## 3.13.1-beta.0

### Patch Changes

- Updated dependencies [7e89dbe]
  - @rzl-zone/ts-types-plus@0.1.7-beta.0

## 3.13.0

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`
- 9f0627e: Update `README` migration notes for NextJS utilities
- Updated dependencies [c29c9c2]
- Updated dependencies [3a85092]
  - @rzl-zone/node-only@0.0.10
  - @rzl-zone/ts-types-plus@0.1.6

## 3.13.0-beta.3

### Patch Changes

- 9f0627e: Update `README` migration notes for NextJS utilities

## 3.13.0-beta.2

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`

## 3.12.1-beta.1

### Patch Changes

- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`
- Updated dependencies [3a85092]
  - @rzl-zone/ts-types-plus@0.1.6-beta.1

## 3.12.1-beta.0

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- Updated dependencies [c29c9c2]
  - @rzl-zone/node-only@0.0.10-beta.0
  - @rzl-zone/ts-types-plus@0.1.6-beta.0

## [3.12.0](https://github.com/rzl-zone/utils-js/compare/v3.11.1...v3.12.0) (2026-04-07)

### Features

- **Config:** **Update** `dependencies` and `devDependencies` version also fix some bug. ([8577565](https://github.com/rzl-zone/utils-js/commit/857756584cb4715b2646d5b41ba6f1cd3e9f88ff))

## [3.11.1](https://github.com/rzl-zone/utils-js/compare/v3.11.0...v3.11.1) (2026-03-29)

### Bug Fixes

- Fixing `isArray` overload type. ([acf1a71](https://github.com/rzl-zone/utils-js/commit/acf1a71d9f0fe2a47f5f8692cd327deb5574c76a))

## [3.11.0](https://github.com/rzl-zone/utils-js/compare/v3.10.0...v3.11.0) (2025-11-10)

### Features

- **`assertIs*`:** Change default `formatCase` to `toKebabCase`, add `useAcronyms` option, and improve TSDoc. ([3de179b](https://github.com/rzl-zone/utils-js/commit/3de179b2ed404a75a23e2bae89086d7cc178ce86))
- **`getPreciseType`:** Add `useAcronyms` option, update defaults, internal refactor, and performance improvements. ([5eab467](https://github.com/rzl-zone/utils-js/commit/5eab46708a3eac620f048fc614c251ecd4901906))

### Bug Fixes

- **`assertIsArray`:** Ensure correct assertion signature for improved type narrowing. ([9093cd6](https://github.com/rzl-zone/utils-js/commit/9093cd69ef07be27a6025dad49aab2467ae5b910))

## [3.10.0](https://github.com/rzl-zone/utils-js/compare/v3.9.1...v3.10.0) (2025-10-25)

### Chore

- **Config:** Update **_Requirement_** minimum engines (`Node.js` to &gt;=18.18.0).
- **Docs:** Update (`README.md`, `CHANGELOG.md`).

See details: ([866c158](https://github.com/rzl-zone/utils-js/commit/866c15827e6ac12a5af485076adb9553756de5cc)).

## [3.9.1](https://github.com/rzl-zone/utils-js/compare/v3.9.0...v3.9.1) (2025-10-22)

### Chore

- Update logo to circle. ([db77828](https://github.com/rzl-zone/utils-js/commit/db77828c4dcdf532ec544e83b958cae4e8ea76d1))

## [3.9.0](https://github.com/rzl-zone/utils-js/compare/v3.8.0...v3.9.0) (2025-10-22)

### Features

- **Enhance:** Utility functions `extractFileName`, `normalizePathname`, `punycodeUtilsJS` and `assertIs*`. ([9fcb842](https://github.com/rzl-zone/utils-js/commit/9fcb8420ad346d4a33a74836be6bc1d98be865fe))

## [3.8.0](https://github.com/rzl-zone/utils-js/compare/v3.7.1...v3.8.0) (2025-10-17)

### Features

- **randomUUID:** Introduce new `randomUUID` utility, fixing some tsDoc utils, and fixing some minor bugs. ([a9d6223](https://github.com/rzl-zone/utils-js/commit/a9d622362a9eed3d6202e893c94ccb4c5ac98a3f))

## [3.7.1](https://github.com/rzl-zone/utils-js/compare/v3.7.0...v3.7.1) (2025-10-16)

### Chore

- **Docs:** Fixing tsDoc example import types from `ClassesValue` to `ClassValues` at `twMergeDefaultV3` and `twMergeDefaultV4`. ([65b255f](https://github.com/rzl-zone/utils-js/commit/65b255f033113e682559afcc2dca3012becdc136))

## [3.7.0](https://github.com/rzl-zone/utils-js/compare/v3.6.0...v3.7.0) (2025-10-16)

### Features

- **cx:** Introduce new `cx` utility and revamp class type system. ([78456ed](https://github.com/rzl-zone/utils-js/commit/78456ed14722a31f539f5ecc488d8bf9dda5d2e4))

## [3.6.0](https://github.com/rzl-zone/utils-js/compare/v3.5.7...v3.6.0) (2025-10-15)

### Features

- Add new utils function `isValidDomain`, `punycodeUtilsJS`, and fixing some bug at `normalizePathname`. ([b8dcdaa](https://github.com/rzl-zone/utils-js/commit/b8dcdaa9f6163d44ab75129745d05d98b62608b3))
- **normalizePathname:** Introduce `NormalizePathnameOptions` and replace `defaultPath` param. ([0d49833](https://github.com/rzl-zone/utils-js/commit/0d49833c6313d85455a0c4ff71e6beb9faf3b1d1))

### Bug Fixes

- Fixing keywords at `package.json`. ([0a10833](https://github.com/rzl-zone/utils-js/commit/0a10833b49752517055885ebed64ded836641aca))
- Fixing some bug at utility `isValidDomain` and add extra options `allowPort`, `allowLocalhost`, and `allowProtocol`, also refactor tsDoc at `punycodeUtilsJS` utility. ([7f94fa0](https://github.com/rzl-zone/utils-js/commit/7f94fa0c88dee34ea65950f203d7115edbf3f805))
- Update url docs web at `README.md`. ([8069cc9](https://github.com/rzl-zone/utils-js/commit/8069cc9f3635e9012eaf687b7383b7b43817373b))

## [3.5.7](https://github.com/rzl-zone/utils-js/compare/v3.5.6...v3.5.7) (2025-09-29)

### Chore

- **Docs:** TsDoc `disableUserInteraction` and `enableUserInteraction`. ([d75c9a5](https://github.com/rzl-zone/utils-js/commit/d75c9a546462e5be895a4c8355a9eec112a5f9cb))

## [3.5.6](https://github.com/rzl-zone/utils-js/compare/v3.5.5...v3.5.6) (2025-09-26)

### Chore

- **Docs:** Fixing tsDoc `shouldForwardProp`. ([c940ec4](https://github.com/rzl-zone/utils-js/commit/c940ec4c566aa3f7e871dd3e2a79ff81510a1810))

## [3.5.5](https://github.com/rzl-zone/utils-js/compare/v3.5.4...v3.5.5) (2025-09-26)

### Bug Fixes

- Fix: function `shouldForwardProp`. ([55433b8](https://github.com/rzl-zone/utils-js/commit/55433b80304516fd32e13a6dfd07627ecaa40532))

## [3.5.4](https://github.com/rzl-zone/utils-js/compare/v3.5.3...v3.5.4) (2025-09-26)

### Bug Fixes

- **Build:** Fixing `generateReferenceIndex` to disable exporting types at index.d.ts, remove duplicate double `\n` at injectingBanner. ([ea7e8e0](https://github.com/rzl-zone/utils-js/commit/ea7e8e0b3edd21a50642dcb5865450d07f006282))
- **Chore:** Update devDeps `@rzl-zone/ts-types-plus` to latest, fixing (build-scripts, eslint-config). ([d9fb9a6](https://github.com/rzl-zone/utils-js/commit/d9fb9a634535fb7a461b63aca3b30d53fd20ba64))
- Fix moving `getPreciseType.utils` to \_private folder for avoid mistake from external, and removing unused or duplicate code at tsup config and change build minify type to terser for browser bundle at tsup config. ([fca2b4b](https://github.com/rzl-zone/utils-js/commit/fca2b4b84d10a2fd82efa3ad26b6eb1c1abaa46c))

## [3.5.3](https://github.com/rzl-zone/utils-js/compare/v3.5.2...v3.5.3) (2025-09-25)

### Bug Fixes

- **Config:** Fixing exports `typesVersions` at package.json. ([af03417](https://github.com/rzl-zone/utils-js/commit/af034178e75852226a0ac585cc339f61bbf753b5))

## [3.5.2](https://github.com/rzl-zone/utils-js/compare/v3.5.1...v3.5.2) (2025-09-25)

### Bug Fixes

- **Build:** Fixing `generateReferenceIndex`. ([498d7e9](https://github.com/rzl-zone/utils-js/commit/498d7e90e2ae89743fb1ecfae90586508af6398f))

## [3.5.1](https://github.com/rzl-zone/utils-js/compare/v3.5.0...v3.5.1) (2025-09-25)

### Bug Fixes

- **Chore:** Update devDeps `@rzl-zone/ts-types-plus` to latest, fixing (tsup, build-scripts, some MD files, and some configs). ([e878e32](https://github.com/rzl-zone/utils-js/commit/e878e3294fcda3a465c8f847b20a8ed1a06d644b))

## [3.5.0](https://github.com/rzl-zone/utils-js/compare/v3.4.0...v3.5.0) (2025-09-20)

### Features

- **Chore:** Update types, dependencies, scripts, tsconfig & README. ([abd4bbd](https://github.com/rzl-zone/utils-js/commit/abd4bbdf93907d5e0610b0d81520a9b123f0693d))

## [3.4.0](https://github.com/rzl-zone/utils-js/compare/v3.3.1...v3.4.0) (2025-09-19)

### Chore

- **Config:** Adding dependencies package **`@rzl-zone/ts-types-plus`** for types-helpers and drop internal types-helper. ([ad5e038](https://github.com/rzl-zone/utils-js/commit/ad5e03894952c663aecadbea4e32ae1359374a54))

## [3.3.1](https://github.com/rzl-zone/utils-js/compare/v3.3.0...v3.3.1) (2025-09-18)

### Chore

- **Docs:** Fixing `README.md` at docs about hint. ([dee811c](https://github.com/rzl-zone/utils-js/commit/dee811cf9ddfba07c8d11d99b0dc89f0bbdd63af))

## [3.3.0](https://github.com/rzl-zone/utils-js/compare/v3.2.0...v3.3.0) (2025-09-18)

### Features

- Add `generate-reference` script and update package.json exports. ([2e58ef8](https://github.com/rzl-zone/utils-js/commit/2e58ef86e54f4da10a5f70d09c734f9a2f20d333))

## [3.2.0](https://github.com/rzl-zone/utils-js/compare/v3.1.1...v3.2.0) (2025-09-17)

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

See details: ([c5ef41e](https://github.com/rzl-zone/utils-js/commit/c5ef41e75bb1aca71b920c90734756ffa1eac8e4)).

## [3.1.1](https://github.com/rzl-zone/utils-js/compare/v3.1.0...v3.1.1) (2025-09-11)

### Bug Fixes

- Add extra options **_keepUndefined_** to handling undefined value at `safeStableStringify`. ([e848bef](https://github.com/rzl-zone/utils-js/commit/e848befa3c39d9d70a0edbdf363342e58bfeb009))
- Fixing `toStringDeepForce` making support handling like **_Primitives Boxed_** (`new Number`, `new String`, `new Boolean`). ([93f16f8](https://github.com/rzl-zone/utils-js/commit/93f16f86add826c83879cb7ba04ff5e0ebd50e10))
- Fixing tsDoc `toStringDeep` and `toNumberDeep`. ([340e9cc](https://github.com/rzl-zone/utils-js/commit/340e9cc52d65b56f3dcc7aa93e7d72f4670b81c3))

## [3.1.0](https://github.com/rzl-zone/utils-js/compare/v3.0.0...v3.1.0) (2025-09-11)

### Features

- Add new function `isBooleanObject`, `isStringObject`, `isNumberObject`, `isInfinityNumber`, (with the tests).
- Fixing `toNumberDeep` and `toStringDeep` also narrows type and tests, update all of function which using (`isBooleanObject`, `isStringObject`, `isNumberObject`).
- Update `isDate` will extra options include with tests, and rest fixing tsDoc.

See details: ([b26c5a5](https://github.com/rzl-zone/utils-js/commit/b26c5a5210b95a38a41bfdaa3af77f60b531097c)).

### Bug Fixes

- Fixing `safeStableStringify` enhance more safe for handling NaN, Infinity, -Infinity for boxed primitives (`new Number()`). ([e89d28a](https://github.com/rzl-zone/utils-js/commit/e89d28a2ac31156b07183322ec3f1002640e37cf))
- Fixing `toStringDeep` to support handling boolean. ([1bd62be](https://github.com/rzl-zone/utils-js/commit/1bd62be4bc23101dd699b2d6efe18c8947a4f7e2))
- Fixing to support handling Infinity and -Infinity at `toStringDeep` and fixing `toNumberDeep`. ([89ebcbc](https://github.com/rzl-zone/utils-js/commit/89ebcbc65c462f5eff8af94258a2570578343b33))

## [3.0.0](https://github.com/rzl-zone/utils-js/compare/v2.0.1...v3.0.0) (2025-09-03)

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

## [2.1.0](https://github.com/rzl-zone/utils-js/compare/v2.0.1...v2.1.0) (2025-08-07)

### Features

- Add new enhance `getPreciseType` function with full type detection and comprehensive tests. ([603a5c8](https://github.com/rzl-zone/utils-js/commit/603a5c8aa2768d73503345056d684585ddffde66))

## [2.0.1](https://github.com/rzl-zone/utils-js/compare/v2.0.0...v2.0.1) (2025-08-07)

### Bug Fixes

- Resolve bug in types return funcion `isArray`. ([7643e91](https://github.com/rzl-zone/utils-js/commit/7643e91398c6c70d0664083b114dcb2791062509))

## [2.0.0](https://github.com/rzl-zone/utils-js/compare/v1.0.4...v2.0.0) (2025-08-06)

### ⚠ BREAKING CHANGES

- **Core:** Version 1.0.0 marks the first stable release. This version establishes a consistent and reliable API surface. All breaking changes moving forward will adhere to semantic versioning.

### Features

- Bump 1.1.0. ([af887bf](https://github.com/rzl-zone/utils-js/commit/af887bfe12e186ba3fec360a393cd4ce015c42f9))
- **Core:** Initiate stable API. ([c412f48](https://github.com/rzl-zone/utils-js/commit/c412f48b12447f5f4397827e72bc5c6f8824edfd))

### Bug Fixes

- Fixing `isObject` generic narrowing types on result logic with custom types, change unknown props as `Extract<string, unknown>` result. ([a4364f8](https://github.com/rzl-zone/utils-js/commit/a4364f8f49509aedc0afaf7b607c3cbadb58eccd))
- Fixing `deleteNestedKey` generic types props. ([b656df6](https://github.com/rzl-zone/utils-js/commit/b656df68b8f243e55f24f90032126a05982dd24c))
- Fixing `isObject` generic narrowing types on result logic. ([1c53ff6](https://github.com/rzl-zone/utils-js/commit/1c53ff699c4f7a25d48be61a72f37d66e57e0b50))
- Fixing `isObject` generic narrowing types on result logic with custom types. ([fd251c9](https://github.com/rzl-zone/utils-js/commit/fd251c90e2098cab58c9edf3eb82212ce2010d87))
- Fixing `isObject` result types generic. ([9ec1978](https://github.com/rzl-zone/utils-js/commit/9ec19787fee6aec25cc55e7ba1da7d14eb17e3cb))
- Fixing `isObject` with internal funcion `isNil` & `isArray`. ([efec254](https://github.com/rzl-zone/utils-js/commit/efec254375db2231370c395c7a0f6430bc7ddc4d))
- Fixing `isObjectOrArray` generic narrowing types on result logic with custom types. ([38dda18](https://github.com/rzl-zone/utils-js/commit/38dda18ffb1c1af7f62b94646644029262bf16d0))
- Fixing by adding overload to `isArray` to handle unknown and generic cases. ([0320718](https://github.com/rzl-zone/utils-js/commit/0320718c4e57cd916569739423e9a86cf9272ce7))
- Fixing by adding add overload to `isObject` to handle unknown and generic cases. ([651c0d1](https://github.com/rzl-zone/utils-js/commit/651c0d13215e4f2359447c042ff8f8b4be083373))
- Fixing by adding add overloads and ensure correct type guard for `isSet`. ([633b117](https://github.com/rzl-zone/utils-js/commit/633b117b5d66c95c8b7e7b2e7102e59497f9c458))
- Fixing correct type guard in `isSafeInteger`. ([ebca4a6](https://github.com/rzl-zone/utils-js/commit/ebca4a6d927dfe5652f9de23dcb00b3099055074))
- Improve `formatDateIntl` type safety and fix optional locale destructuring. ([e1dc600](https://github.com/rzl-zone/utils-js/commit/e1dc600be642083f26b20c487f5141cdbc6da96c))
- Improve `isArray` generic narrowing using `Extract<T, unknown[]>`. ([f6410d5](https://github.com/rzl-zone/utils-js/commit/f6410d5db91c9175ec1cad7e0ffc070f36280ac9))
- Improve `isNonEmptyArray` generic narrowing using `Extract<T, unknown[]>` and support overload to handle unknown with generic class. ([202f6ef](https://github.com/rzl-zone/utils-js/commit/202f6efd490539dbd63ec605092c598690d67d7f))
- Improve `isObjectLoose` generic narrowing type. ([f15af2c](https://github.com/rzl-zone/utils-js/commit/f15af2c8b0a67b93b92ec37dd95b0912221ff81c))
- Improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class. ([2a8000c](https://github.com/rzl-zone/utils-js/commit/2a8000c17fcb9b4619377bf9bf0bedb7021bb003))
- Improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks. ([8ab1d42](https://github.com/rzl-zone/utils-js/commit/8ab1d42db944e8279c6d57b9bd3ede29af7243f3))
- **Release:** Bump version to `1.0.3`. ([bef7064](https://github.com/rzl-zone/utils-js/commit/bef70641fc169483a3099e6e8181af6443171006))
- **Release:** Bump version to `1.0.4`. ([c90c061](https://github.com/rzl-zone/utils-js/commit/c90c06109dca36eec16381cb3a522cd680abcf3f))
- Resolve bug in core logic and sync types/tests. ([ad03f7a](https://github.com/rzl-zone/utils-js/commit/ad03f7a7732fe3d87eced817271ab1d6fa797f45))

## [1.0.4](https://github.com/rzl-zone/utils-js/compare/v1.0.3...v1.0.4) (2025-08-06)

### Bug Fixes

- **Release:** Bump version to `1.0.4`. ([c90c061](https://github.com/rzl-zone/utils-js/commit/c90c06109dca36eec16381cb3a522cd680abcf3f))

## [1.0.3](https://github.com/rzl-zone/utils-js/compare/v1.0.2...v1.0.3) (2025-08-06)

### Bug Fixes

- **Release:** Bump version to `1.0.3`. ([bef7064](https://github.com/rzl-zone/utils-js/commit/bef70641fc169483a3099e6e8181af6443171006))

## [1.0.2](https://github.com/rzl-zone/utils-js/compare/v1.0.1...v1.0.2) (2025-08-06)

### Bug Fixes

- Fixing `isObject` generic narrowing types on result logic with custom types, change unknown props as `Record<string, unknown>` result. ([a4364f8](https://github.com/rzl-zone/utils-js/commit/a4364f8f49509aedc0afaf7b607c3cbadb58eccd))
- Fixing `deleteNestedKey` generic types props. ([b656df6](https://github.com/rzl-zone/utils-js/commit/b656df68b8f243e55f24f90032126a05982dd24c))
- Fixing `isObject` generic narrowing types on result logic. ([1c53ff6](https://github.com/rzl-zone/utils-js/commit/1c53ff699c4f7a25d48be61a72f37d66e57e0b50))
- Fixing `isObject` generic narrowing types on result logic with custom types. ([fd251c9](https://github.com/rzl-zone/utils-js/commit/fd251c90e2098cab58c9edf3eb82212ce2010d87))
- Fixing `isObject` with internal funcion `isNil` & `isArray`. ([efec254](https://github.com/rzl-zone/utils-js/commit/efec254375db2231370c395c7a0f6430bc7ddc4d))
- Fixing `isObjectOrArray` generic narrowing types on result logic with custom types. ([38dda18](https://github.com/rzl-zone/utils-js/commit/38dda18ffb1c1af7f62b94646644029262bf16d0))
- Improve `formatDateIntl` type safety and fix optional locale destructuring. ([e1dc600](https://github.com/rzl-zone/utils-js/commit/e1dc600be642083f26b20c487f5141cdbc6da96c))
- Resolve bug in core logic and sync types/tests. ([ad03f7a](https://github.com/rzl-zone/utils-js/commit/ad03f7a7732fe3d87eced817271ab1d6fa797f45))

## [1.0.1](https://github.com/rzl-zone/utils-js/compare/v1.0.0...v1.0.1) (2025-08-06)

### Bug Fixes

- Fixing `isObject` result types generic. ([9ec1978](https://github.com/rzl-zone/utils-js/commit/9ec19787fee6aec25cc55e7ba1da7d14eb17e3cb))
- Fixing by adding overload to `isArray` to handle unknown and generic cases. ([0320718](https://github.com/rzl-zone/utils-js/commit/0320718c4e57cd916569739423e9a86cf9272ce7))
- Fixing by adding overload to `isObject` to handle unknown and generic cases. ([651c0d1](https://github.com/rzl-zone/utils-js/commit/651c0d13215e4f2359447c042ff8f8b4be083373))
- Fixing by adding overloads and ensure correct type guard for `isSet`. ([633b117](https://github.com/rzl-zone/utils-js/commit/633b117b5d66c95c8b7e7b2e7102e59497f9c458))
- Fixing correct type guard in `isSafeInteger`. ([ebca4a6](https://github.com/rzl-zone/utils-js/commit/ebca4a6d927dfe5652f9de23dcb00b3099055074))
- Improve `isArray` generic narrowing using `Extract<T, unknown[]>`. ([f6410d5](https://github.com/rzl-zone/utils-js/commit/f6410d5db91c9175ec1cad7e0ffc070f36280ac9))
- Improve `isNonEmptyArray` generic narrowing using `Extract<T, unknown[]>` and support overload to handle unknown with generic class. ([202f6ef](https://github.com/rzl-zone/utils-js/commit/202f6efd490539dbd63ec605092c598690d67d7f))
- Improve `isObjectLoose` generic narrowing type. ([f15af2c](https://github.com/rzl-zone/utils-js/commit/f15af2c8b0a67b93b92ec37dd95b0912221ff81c))
- Improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class. ([2a8000c](https://github.com/rzl-zone/utils-js/commit/2a8000c17fcb9b4619377bf9bf0bedb7021bb003))
- Improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks. ([8ab1d42](https://github.com/rzl-zone/utils-js/commit/8ab1d42db944e8279c6d57b9bd3ede29af7243f3))

## 1.0.0 (2025-08-05)

### ⚠ BREAKING CHANGES

- **Core:**
  - Version 1.0.0 marks the first stable release.
  - This version establishes a consistent and reliable API surface.
  - All breaking changes moving forward will adhere to semantic versioning.

### Features

- **Core:** initiate stable API. ([c412f48](https://github.com/rzl-zone/utils-js/commit/c412f48b12447f5f4397827e72bc5c6f8824edfd))
