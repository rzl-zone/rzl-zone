---
"@rzl-zone/build-tools": patch
"@rzl-zone/build-tools-cli": patch
"@rzl-zone/click-feedback": patch
"@rzl-zone/core": patch
"@rzl-zone/core-react": patch
"@rzl-zone/docs-ui": patch
"@rzl-zone/eslint": patch
"@rzl-zone/next-kit": patch
"@rzl-zone/node-only": patch
"@rzl-zone/ts-types-plus": patch
---

Improve performance and stability across packages, with updates to docs-ui and next-kits

- docs-ui:
  - replace `cn` utils with `twMerge(cx(...))` for better performance
  - limit Tailwind content sources to apps only
  - remove unnecessary "use client" for improved RSC support
  - keep `cnDeprecated` for backward compatibility

- next-kits:
  - relax provider validation (no longer throws, logs a warning once)
  - add "use client" to `RzlThemeAppProvider`

- internal:
  - update related internal packages and dependencies
