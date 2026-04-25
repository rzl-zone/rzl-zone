import { z } from "zod";
import { isReactNode } from "@rzl-zone/core-react/utils";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

/** * Zod 4 default page schema */
const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
  _openapi: z.looseObject({}).optional()
});
/** * Zod 4 default meta schema */
const defaultMetaSchema = z.object({
  title: z.string().optional(),
  pages: z.array(z.string()).optional(),
  description: z.string().optional(),
  root: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  collapsible: z.boolean().optional(),
  icon: z.string().optional()
});

export const createReactNodeSchema = (
  field: string,
  message?: string
): z.ZodType<React.ReactNode> =>
  z.any().superRefine((val, ctx) => {
    if (!isReactNode(val)) {
      ctx.addIssue({
        code: "custom",
        message: isNonEmptyString(message)
          ? message
          : `\`${field}\` must be a valid ReactNode`
      });
    }
  });

export const pageSchema = frontmatterSchema.extend({
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
      title: z.optional(z.union([z.string(), z.null()])),
      description: z.optional(z.union([z.string(), z.null()]))
    })
  ),
  metaSeoData: z.optional(
    z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string())
    })
  )
});
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

export type PageSchemaType = z.infer<typeof pageSchema>;
export type MetaSchemaType = z.infer<typeof metaSchema>;
