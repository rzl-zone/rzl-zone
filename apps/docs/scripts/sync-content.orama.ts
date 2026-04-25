// import "dotenv/config";

// import * as fs from "node:fs/promises";

// import { CloudManager } from "@oramacloud/client";
// import { cleanSpecialAttributeMdx } from "@workspace/fd-core/utils";
// import {
//   type OramaDocument,
//   sync
// } from "@workspace/fd-core/search/orama/cloud";

// import { env } from "@/utils/env";

// // the path of pre-rendered `static.json`, choose one according to your React framework
// const filePath = {
//   next: ".next/server/app/static.json.body",
//   "tanstack-start": ".output/public/static.json",
//   "react-router": "build/client/static.json",
//   waku: "dist/public/static.json"
// }["next"];

// async function main() {
//   // private API key
//   const apiKey = env.ORAMA_SECRET_API_KEY;

//   if (!apiKey) {
//     console.error("no api key for Orama found, skipping");
//     return;
//   }

//   const content = await fs.readFile(filePath);
//   const records = JSON.parse(
//     cleanSpecialAttributeMdx(content.toString(), { cleanTagTocOnly: true })
//   ) as OramaDocument[];
//   const manager = new CloudManager({ api_key: apiKey });

//   try {
//     await sync(manager, {
//       index: "tua5bbz06s96xsqpftrc2b2c",
//       documents: records
//     });

//     console.log(`search updated: ${records.length} records`);
//   } catch (error) {
//     console.error(error);
//   }
// }

// void main();
