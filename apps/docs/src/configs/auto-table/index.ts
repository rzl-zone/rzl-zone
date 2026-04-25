import {
  createFileSystemGeneratorCache,
  createGenerator
} from "@/components/mdx/auto-type-table";

export const generatorCreature = createGenerator({
  // set a cache, necessary for serverless platform like Vercel
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript")
});
