# @rzl-zone/docs-ui

## 0.0.10

### Patch Changes

- 77fa236: Improve performance and stability across packages, with updates to docs-ui and next-kits
  - `docs-ui`:
    - replace `cn` utils with `twMerge(cx(...))` for better performance
    - limit Tailwind content sources to apps only
    - remove unnecessary `"use client"` for improved **RSC support**
    - keep `cnDeprecated` for backward compatibility
  - `next-kits`:
    - relax provider validation (no longer throws, logs a warning once)
    - add `"use client"` to `RzlThemeAppProvider`
  - **internal**:
    - update related internal packages and dependencies

- Updated dependencies [77fa236]
  - @rzl-zone/next-kit@0.9.9

## 0.0.9

### Patch Changes

- 9a5c803: chore: refine and improve TSDoc comments across packages.
- Updated dependencies [9a5c803]
  - @rzl-zone/click-feedback@0.0.8
  - @rzl-zone/core@0.0.9
  - @rzl-zone/core-react@0.0.9
  - @rzl-zone/next-kit@0.9.8

## 0.0.8

### Patch Changes

- e3c093f: Update package descriptions and refresh monorepo `README.md`.
- Updated dependencies [e3c093f]
  - @rzl-zone/core-react@0.0.8
  - @rzl-zone/core@0.0.8
  - @rzl-zone/click-feedback@0.0.7
  - @rzl-zone/next-kit@0.9.7

## 0.0.7

### Patch Changes

- 1619171: Patch release with README improvements and internal updates
- Updated dependencies [1619171]
  - @rzl-zone/click-feedback@0.0.7
  - @rzl-zone/core-react@0.0.7
  - @rzl-zone/next-kit@0.9.6
  - @rzl-zone/core@0.0.7
