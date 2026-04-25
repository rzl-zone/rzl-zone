// import "dotenv/config";

// import * as fs from "node:fs";

// // @ts-expect-error separate package
// import { algoliasearch } from "algoliasearch";

// import { sync, type DocumentRecord } from "fumadocs-core/search/algolia";

// import { env } from "@/utils/env";

// // the path of pre-rendered `static.json`, choose one according to your React framework
// const filePath = {
//   next: ".next/server/app/static.json.body",
//   "tanstack-start": ".output/public/static.json",
//   "react-router": "build/client/static.json",
//   waku: "dist/public/static.json"
// }["next"];

// const content = fs.readFileSync(filePath);

// const records = JSON.parse(content.toString()) as DocumentRecord[];

// const client = algoliasearch(
//   env.NEXT_PUBLIC_ALGOLIA_APP_ID,
//   env.ALGOLIA_SECRET_API_KEY
// );

// // update the index settings and sync search indexes
// void sync(client, {
//   indexName: "document",
//   documents: records
// });
