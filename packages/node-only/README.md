## Node Only

Marker package to restrict imports to **Node.js** or server-only environments.

Helps prevent client-side usage of server modules and improves boundary safety for **React Server Components**, **TypeScript**, and **JavaScript** projects.

### Example usage

```ts
import "@rzl-zone/node-only";

import fs from "node:fs";

export function readConfig() {
  return fs.readFileSync("./config.json", "utf-8");
}
```

If this module is imported inside a client-side environment, it will throw an error and prevent accidental usage.

[Read More Documentation](https://rzlzone.vercel.app/docs/node-only)
