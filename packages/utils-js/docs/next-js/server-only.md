<h3 id="docs-sub-main--title">
  Docs for Next.JS Utils - Server Only `@rzl-zone/utils-js/next/server`    
</h3>
     
  
  #### 🚀 Server-only Helpers (Next.js)

| <small>Function / Type </small>                            | <small>What it does</small>                                                                                                                                                                                                   | <small>Reads / Validates</small>                                                                                                                                     | <small>Example Output</small>                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| <small>`getClientIpOrUrl(request, includeFullUrl)`</small> | <small>Retrieves the real client IP address and constructs the full URL using headers like `x-forwarded-for`, `x-forwarded-proto`, and `x-forwarded-port`. Designed for **Next.js middleware / server actions** only.</small> | <small>✅ Checks `NextRequest` instance<br>✅ Reads `x-forwarded-for`, `x-forwarded-proto`, `x-forwarded-port`<br>✅ Validates `boolean` on `includeFullUrl`</small> | <small>`"127.0.0.1"`<br>or `"http://127.0.0.1:3000"`</small> |

#### ⚡ Example for `"@rzl-zone/utils-js/next/server"`: Server-only helpers (middleware/server-action)

```ts
import { NextRequest } from "next/server";
import { getClientIpOrUrl } from "@rzl-zone/utils-js/next/server";

export function middleware(request: NextRequest) {
  console.log(getClientIpOrUrl(request)); // full URL
  console.log(getClientIpOrUrl(request, false)); // IP only
  return new Response("OK");
}
```

#### ⚠️ Important:

If you run this outside of a Next.js environment (like plain Node.js or in non-Next projects), you might see errors such as:

```js
  Error: Cannot find module 'next/server'
  // or:
  Could not resolve "next/server"
```

---

[⬅ Back](https://github.com/rzl-zone/utils-js?tab=readme-ov-file#nextjs-support--server-only)

---
