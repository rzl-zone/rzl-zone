# @rzl-zone/next-kit

## 0.9.9

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

## 0.9.8

### Patch Changes

- 9a5c803: chore: refine and improve TSDoc comments across packages.
- Updated dependencies [9a5c803]
  - @rzl-zone/core@0.0.9
  - @rzl-zone/core-react@0.0.9
  - @rzl-zone/ts-types-plus@0.1.5

## 0.9.7

### Patch Changes

- Updated dependencies [e3c093f]
  - @rzl-zone/core-react@0.0.8
  - @rzl-zone/core@0.0.8
  - @rzl-zone/ts-types-plus@0.1.4

## 0.9.6

### Patch Changes

- 1619171: Patch release with README improvements and internal updates
- Updated dependencies [1619171]
  - @rzl-zone/core-react@0.0.7
  - @rzl-zone/core@0.0.7
  - @rzl-zone/ts-types-plus@0.1.4
