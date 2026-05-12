/* eslint-disable @typescript-eslint/no-unused-vars */
import type { slugify } from "../slugify";
import type { toCamelCase } from "../toCamelCase";
import type { toDotCase } from "../toDotCase";
import type { toKebabCase } from "../toKebabCase";
import type { toLowerCase } from "../toLowerCase";
import type { toPascalCase } from "../toPascalCase";
import type { toPascalCaseSpace } from "../toPascalCaseSpace";
import type { toSnakeCase } from "../toSnakeCase";

import { isSet } from "@/predicates/is/isSet";
import type { StringCollection, StringLike } from "./case.types";

import { isArray } from "@/predicates/is/isArray";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/**
 * @internal ***Util helper for {@link toCamelCase}, {@link toPascalCaseSpace}, {@link toPascalCase}, {@link toLowerCase}, {@link toKebabCase}, {@link toSnakeCase}, {@link toDotCase} and {@link slugify}.***
 */
export const validateCaseInputWordsCase = (
  input: NonNullable<StringLike>
): string[] => {
  let result: string = "";

  if (isArray(input)) {
    result = input
      .map((x) => (isNonEmptyString(x) ? x.trim() : ""))
      .filter((x) => x.length)
      .join("-");
  } else if (isNonEmptyString(input)) {
    result = input.trim();
  }

  return result.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
};

/**
 * @internal ***Util helper for {@link toCamelCase}, {@link toPascalCaseSpace}, {@link toPascalCase}, {@link toLowerCase}, {@link toKebabCase}, {@link toSnakeCase}, {@link toDotCase} and {@link slugify}.***
 */
export const validateCaseIgnoreWordsCase = (
  ignoreWord?: StringCollection
): Set<string> => {
  const result = new Set<string>([]);

  const normalizeWord = (word: string) =>
    word
      .trim()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .join("");

  if (isNonEmptyString(ignoreWord)) {
    const clean = normalizeWord(ignoreWord);
    if (clean) result.add(clean);
  }
  if (isNonEmptyArray(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }
  if (isSet(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }

  return result;
};
