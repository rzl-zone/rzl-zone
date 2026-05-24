# @rzl-zone/next-kit

## 0.10.2

### Patch Changes

- Updated dependencies [688282a]
- Updated dependencies [688282a]
- Updated dependencies [688282a]
  - @rzl-zone/utils-js@3.14.0
  - @rzl-zone/ts-types-plus@0.1.8
  - @rzl-zone/node-only@0.0.11
  - @rzl-zone/core@0.0.12
  - @rzl-zone/core-react@0.0.12

## 0.10.2-beta.0 (2026-05-24)

### Patch Changes

- Updated dependencies [688282a]
- Updated dependencies [688282a]
- Updated dependencies [688282a]
  - @rzl-zone/utils-js@3.14.0-beta.0
  - @rzl-zone/ts-types-plus@0.1.8-beta.0
  - @rzl-zone/node-only@0.0.11-beta.0
  - @rzl-zone/core@0.0.12-beta.0
  - @rzl-zone/core-react@0.0.12-beta.0

## 0.10.1 (2026-05-20)

### Patch Changes

- Updated dependencies [7e89dbe]
  - @rzl-zone/ts-types-plus@0.1.7
  - @rzl-zone/utils-js@3.13.1
  - @rzl-zone/core@0.0.11
  - @rzl-zone/core-react@0.0.11

## 0.10.1-beta.0 (2026-05-20)

### Patch Changes

- Updated dependencies [7e89dbe]
  - @rzl-zone/ts-types-plus@0.1.7-beta.0
  - @rzl-zone/utils-js@3.13.1-beta.0
  - @rzl-zone/core@0.0.11-beta.0
  - @rzl-zone/core-react@0.0.11-beta.0

## 0.10.0 (2026-05-12)

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`
- Updated dependencies [c29c9c2]
- Updated dependencies [3a85092]
- Updated dependencies [9f0627e]
- Updated dependencies [cb2bfb1]
  - @rzl-zone/core@0.0.10
  - @rzl-zone/core-react@0.0.10
  - @rzl-zone/node-only@0.0.10
  - @rzl-zone/ts-types-plus@0.1.6
  - @rzl-zone/utils-js@3.13.0

## 0.10.0-beta.3 (2026-05-12)

### Patch Changes

- Updated dependencies [9f0627e]
  - @rzl-zone/utils-js@3.13.0-beta.3
  - @rzl-zone/core@0.0.10-beta.3
  - @rzl-zone/core-react@0.0.10-beta.3

## 0.10.0-beta.2 (2026-05-12)

### Minor Changes

- cb2bfb1: migrate Next.js utilities into `@rzl-zone/next-kit` and add optimized Tailwind merge APIs to `@rzl-zone/utils-js`

### Patch Changes

- Updated dependencies [cb2bfb1]
  - @rzl-zone/utils-js@3.13.0-beta.2
  - @rzl-zone/core@0.0.10-beta.2
  - @rzl-zone/core-react@0.0.10-beta.2

## 0.9.10-beta.1 (2026-05-12)

### Patch Changes

- 3a85092: Improve `README` documentation and adjust internal `noUncheckedIndexedAccess` handling logic at `@rzl-zone/utils-js`
- Updated dependencies [3a85092]
  - @rzl-zone/ts-types-plus@0.1.6-beta.1
  - @rzl-zone/utils-js@3.12.1-beta.1
  - @rzl-zone/core@0.0.10-beta.1
  - @rzl-zone/core-react@0.0.10-beta.1

## 0.9.10-beta.0 (2026-05-12)

### Patch Changes

- c29c9c2: Integrate `@rzl-zone/utils-js` into the monorepo, update workspace dependencies, upgrade tooling versions, and improve package documentation.
- Updated dependencies [c29c9c2]
  - @rzl-zone/core@0.0.10-beta.0
  - @rzl-zone/core-react@0.0.10-beta.0
  - @rzl-zone/ts-types-plus@0.1.6-beta.0
  - @rzl-zone/utils-js@3.12.1-beta.0

## 0.9.9 (2026-05-06)

### Patch Changes

- 77fa236: Improve provider handling and theme setup:
  - relax provider validation (no longer throws, logs a warning once)
  - add `"use client"` to `RzlThemeAppProvider`

## 0.9.8 (2026-04-30)

### Patch Changes

- 9a5c803: chore: refine and improve TSDoc comments across packages.
- Updated dependencies [9a5c803]
  - @rzl-zone/core@0.0.9
  - @rzl-zone/core-react@0.0.9
  - @rzl-zone/ts-types-plus@0.1.5

## 0.9.7 (2026-04-28)

### Patch Changes

- Updated dependencies [e3c093f]
  - @rzl-zone/core-react@0.0.8
  - @rzl-zone/core@0.0.8
  - @rzl-zone/ts-types-plus@0.1.4

## 0.9.6 (2026-04-25)

### Patch Changes

- 1619171: Patch release with README improvements and internal updates
- Updated dependencies [1619171]
  - @rzl-zone/core-react@0.0.7
  - @rzl-zone/core@0.0.7
  - @rzl-zone/ts-types-plus@0.1.4

## 0.9.1 (2025-11-25)

### Bug Fixes

- **`tsDoc`:** Fixing typo tsDoc at `progress-bar`.
- **`tsDoc`:** Fixing typo tsDoc at `themes`.

## 0.9.0 (2025-11-25)

### Features

- Add **Pages Router** support for `progress-bar` and `themes`; add new APIs `compareProps` and `withMemo`; improve `withSuspense`; refactor imports and API names.

## 0.8.0 (2025-11-22)

### Features

- **`themes`:** Add support for **`Pages Dir`** and fixing some bug at utility `isReactNode`.

### Bug Fixes

- **`package.json`:** Add new `themes/pages-dir` path to `typesVersions`.

## 0.7.0 (2025-11-20)

### Features

- **`themes`:** Add new options `metaColorSchemeValue` for `ProvidersThemesApp` and fixing some bugs.

## 0.6.11 (2025-11-16)

### Bug Fixes

- **`themes`:** Fixing some bug in internal `cleaningScriptFuncToString` at `themes` category util.

## 0.6.10 (2025-11-16)

### Bug Fixes

- **`themes`:** Fixing some bug `scriptArgs` at `themes` category util.

## 0.6.9 (2025-11-16)

### Bug Fixes

- **`Chore`:** Update README.md.
- **`themes`:** Fixing some bug, types and tsDoc at `themes` category util.

## 0.6.8 (2025-11-14)

### Bug Fixes

- **`Chore`:** Update `@rzl-zone/utils-js` version and moving to main deps, fix `README.md`, fix some tsDoc.

## 0.6.7 (2025-10-31)

### Bug Fixes

- Fixing return types for `nodeEnv`.

## 0.6.6 (2025-10-31)

### Bug Fixes

- **`DevDeps`:** Update `@rzl-zone/utils-js` version.

## 0.6.5 (2025-10-31)

### Bug Fixes

- Fixing node env runtime checker.

## 0.6.4 (2025-10-23)

### Bug Fixes

- **`Chore`:** Fixing some tsDoc and `CHANGELOG.md`.

## 0.6.3 (2025-10-23)

### Bug Fixes

- **`Chore`:** Fixing `README.md`.
- Fixing export "./utils" at `package.json`.

## 0.6.2 (2025-10-23)

### Bug Fixes

- **`Chore`:** Fixing `README.md`.

## 0.6.1 (2025-10-23)

### Bug Fixes

- **`Chore`:** Fixing script prepublishOnly at `package.json`.

## 0.6.0 (2025-10-23)

### Features

- Add features utility `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, `resumeRzlProgress` for control `progress-bar`.
- Add new extra types category for ts developer.
- Add new feature `top-loader`.
- Add new utility function category.
- **`Chore`:** Update peerDependencies for NextJS support version 16.x, update Requirement NodeJs minimum version 20.9.x. update devDeps `@rzl-zone/utils-js` version `3.9.1`.
- initial setup.
- **`Refactor`:** Refactor folder `progress-bar`, fix build scripts and tsconfig, and some logic.

### Bug Fixes

- **`Chore`:** Fixing bug in the lockfile don't match specifiers in `package.json`.
- **`Chore`:** Update deprecated devDeps packages, and uninstall unused packages.
- **`Chore`:** Update devDeps version and fixing some package from devDeps to deps.
- **`Chore`:** Update some .md files, and remove unused config file for build.
- Clean some unused types wrapped by `Prettify` types.
- Fixing bug on component displayName at isProdEnv only.
- Fixing bundle when build at new category `utils`.
- Fixing error message, tsconfig options, and refactor some structure folder, also fixing some tsDoc.
- Fixing exports at `package.json`, and fix readme.md
- Fixing exports at `package.json`, fix "use client" marks at index top-loader, fix `readme.md`.
- Fixing exports path at `package.json`.
- Fixing exports top-loader/css path, and docs.
- Fixing exports top-loader/css path.
- Fixing exports top-loader/default.css path, and docs.
- Fixing generateReferenceIndex for build.
- Fixing React is not defined at build time, because forgot import default react.
- Fixing tsDoc utilities `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, `resumeRzlProgress` for control `progress-bar`.
- Fixing tsup config and tsconfig, also fix some bug at build script.
- Fixing types result at `extra/context`.
- Full reset release-please to use `0.0.1`.
- Remove unused displayName for react component internal at `themes` category.
- Try to fixing bundle build error about (ecmascript)}["fileURLToPath"] is not a function (2).
- Try to fixing bundle build error about (ecmascript)}["fileURLToPath"] is not a function.
- TsDoc for `ProvidersThemesApp`.
- Update docs at `Readme.md`.

## 0.5.2 (2025-10-01)

### Bug Fixes

- Fixing exports path at `package.json`.

## 0.5.1 (2025-09-29)

### Bug Fixes

- Clean some unused types wrapped by `Prettify` types.
- Fixing tsDoc utilities `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, `resumeRzlProgress` for control `progress-bar`.

## 0.5.0 (2025-09-29)

### Features

- Add features utility `isRenderedRzlProgress`, `isStartedRzlProgress`, `pauseRzlProgress`, resumeRzlProgress`for control`progress-bar`.

### Bug Fixes

- TsDoc for `ProvidersThemesApp`.
- Update docs at Readme.md.

## 0.4.1 (2025-09-26)

### Bug Fixes

- **`Chore`:** Fixing bug in the lockfile don't match specifiers in `package.json`.
- **`Chore`:** Update devDeps version and fixing some package from devDeps to deps.

## 0.4.0 (2025-09-26)

### Features

- Add new extra types category for ts developer.

### Bug Fixes

- Removing unused displayName for react component internal at `themes` category.

## 0.3.1 (2025-09-26)

### Bug Fixes

- Fixing bundle when build at new category `utils`.

## 0.3.0 (2025-09-26)

### Features

- Add new utility function category.

### Bug Fixes

- **`Chore`:** Update deprecated devDeps packages, and uninstall unused packages.
- **`Chore`:** Update some .md files, and remove unused config file for build.

## 0.2.0 (2025-09-25)

### Features

- **`Refactor`:** Refactor folder `progress-bar`, fix build scripts and tsconfig, and some logic.

### Bug Fixes

- Fixing bug on component displayName at isProdEnv only.
- Fixing tsup config and tsconfig, also fix some bug at build script.

## 0.1.10 (2025-09-24)

### Bug Fixes

- Fixing generateReferenceIndex for build.

## 0.1.9 (2025-09-24)

### Bug Fixes

- Fixing error message, tsconfig options, and refactor some structure folder, also fixing some tsDoc.

## 0.1.8 (2025-09-23)

### Bug Fixes

- Fixing exports top-loader/default.css path, and docs.

## 0.1.7 (2025-09-23)

### Bug Fixes

- Fixing types result at extra/context.

## 0.1.6 (2025-09-23)

### Bug Fixes

- Fixing exports top-loader/css path, and docs.
- Fixing exports top-loader/css path.

## 0.1.5 (2025-09-23)

### Bug Fixes

- Fixing exports at **`package.json`**, fix **`"use client"`** marks at index top-loader, fix **`readme.md`**.

## 0.1.4 (2025-09-23)

### Bug Fixes

- Try to fixing bundle build error about (ecmascript)/["fileURLToPath"] is not a function (2).

## 0.1.3 (2025-09-23)

### Bug Fixes

- Try to fixing bundle build error about (ecmascript)/["fileURLToPath"] is not a function.

## 0.1.2 (2025-09-23)

### Bug Fixes

- Fixing React is not defined at build time, because forgot import default react.

## 0.1.1 (2025-09-23)

### Bug Fixes

- Fixing exports at package.json, and fix readme.md.

## 0.1.0 (2025-09-23)

### Features

- Add new feature `top-loader`.

## 0.0.1 (2025-08-05)

### Features

- Initial setup.

### Bug Fixes

- Full reset release-please to use 0.0.1.
