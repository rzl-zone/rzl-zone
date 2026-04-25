// import "@rzl-zone/node-only";

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export function createCache() {
  const dir = path.join(process.cwd(), ".next/fumadocs-typescript");
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // it fails on Vercel as of 12 May, we can skip it
  }

  return {
    write(input: string, data: unknown) {
      const hash = createHash("SHA256")
        .update(input)
        .digest("hex")
        .slice(0, 12);

      fs.writeFileSync(path.join(dir, `${hash}.json`), JSON.stringify(data));
    },
    read(input: string): unknown | undefined {
      const hash = createHash("SHA256")
        .update(input)
        .digest("hex")
        .slice(0, 12);

      try {
        return JSON.parse(
          fs.readFileSync(path.join(dir, `${hash}.json`)).toString()
        );
      } catch {
        return;
      }
    }
  };
}
