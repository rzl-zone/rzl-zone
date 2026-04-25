import { z } from "zod";
import {
  frontmatterSchema,
  metaSchema as defaultMetaSchema
} from "fumadocs-mdx/config";

export type DocsSchemaType = z.infer<typeof docsSchema>;

export const docsSchema = frontmatterSchema.extend({
  title: z.optional(z.string()),
  pageName: z.string({
    error: (e) =>
      `\`pageName\` is required for naming file for linking or navigation, expected string, but received: ${e.input}.`
  }),
  pageNameAlias: z.optional(z.string()),
  lastModified: z.optional(z.union([z.date()])),
  lastUpdateData: z.optional(z.union([z.date(), z.string(), z.number()])),
  packageMeta: z.object({
    name: z.union([z.string(), z.null()], {
      error: (e) =>
        `\`name\` is required for naming package, expected string or null, but received: ${e.input}.`
    }),
    version: z.optional(z.union([z.string(), z.null()])),
    keywords: z.optional(z.union([z.string(), z.array(z.string()), z.null()])),
    tag: z.union([z.string(), z.array(z.string()), z.null()], {
      error: (e) =>
        `\`tag\` is required for searching, expected string, string array or null, but received: ${e.input}.`
    })
  }),
  pageData: z.optional(
    z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string())
    })
  ),
  metaSeoData: z.optional(
    z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string())
    })
  )
});

export type MetaSchemaType = z.infer<typeof metaSchema>;

export const metaSchema = defaultMetaSchema.extend({
  pageName: z.optional(
    z.string({
      error: (e) =>
        `\`pageName\` is required for naming file for linking or navigation, expected string or undefined, but received: ${e.input}.`
    })
  ),
  pageNameAlias: z.optional(
    z.string({
      error: (e) =>
        `\`pageNameAlias\` is required for aliasing naming file for linking or navigation, expected string or undefined, but received: ${e.input}.`
    })
  )
});
