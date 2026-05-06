---
"@rzl-zone/docs-ui": patch
"@rzl-zone/next-kit": patch
---

Improve performance and stability across packages, with updates to docs-ui and next-kits

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
