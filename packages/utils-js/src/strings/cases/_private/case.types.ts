/* eslint-disable @typescript-eslint/no-unused-vars */
import type { slugify } from "../slugify";
import type { toCamelCase } from "../toCamelCase";
import type { toDotCase } from "../toDotCase";
import type { toKebabCase } from "../toKebabCase";
import type { toLowerCase } from "../toLowerCase";
import type { toPascalCase } from "../toPascalCase";
import type { toPascalCaseSpace } from "../toPascalCaseSpace";
import type { toSnakeCase } from "../toSnakeCase";
import type { Nilable } from "@rzl-zone/ts-types-plus";

/** --------------------------------------------------
 * * ***Represents a string input.***
 * --------------------------------------------------
 * - **Can be one of:**
 *    - A single `string`
 *    - An array of strings (`string[]`)
 *    - A readonly array of strings (`readonly string[]`)
 *    - `null` or `undefined`
 * @template T - A string or array of strings.
 * @private ***types input for {@link toCamelCase}, {@link toPascalCaseSpace}, {@link toPascalCase}, {@link toLowerCase}, {@link toKebabCase}, {@link toSnakeCase}, {@link toDotCase} and {@link slugify}.***
 */
export type StringLike = Nilable<string | string[] | ReadonlyArray<string>>;

/** --------------------------------------------------
 * * ***Represents a collection of strings.***
 * --------------------------------------------------
 * - **Can be one of:**
 *    - A single `string`
 *    - An array of strings (`string[]`)
 *    - A readonly array of strings (`readonly string[]`)
 *    - A `Set<string>`
 *    - A `ReadonlySet<string>`
 * @private ***types options for {@link toCamelCase}, {@link toPascalCaseSpace}, {@link toPascalCase}, {@link toLowerCase}, {@link toKebabCase}, {@link toSnakeCase}, {@link toDotCase} and {@link slugify}.***
 */
export type StringCollection =
  | string
  | string[]
  | ReadonlyArray<string>
  | Set<string>
  | ReadonlySet<string>;
