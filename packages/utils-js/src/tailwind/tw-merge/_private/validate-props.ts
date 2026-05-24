import type { Config as TwConfig } from "tailwindcss";
import type { ConfigExtension } from "tailwind-merge-v3";

import type { OptionsMergeTwClsV3 } from "../v3/_private/types";

import { isNumber } from "@/predicates/is/isNumber";
import { isFunction } from "@/predicates/is/isFunction";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

export type TailwindConfig = TwConfig;

/**
 * @internal
 */
type TwMergeConfigExt = ConfigExtension<string, string>;

/**
 * @internal
 */
type ValidatorTwMergeReturn = {
  config: TwConfig;
  override: TwMergeConfigExt["override"];
  cacheSize: TwMergeConfigExt["cacheSize"];
  prefix: TwMergeConfigExt["prefix"];
  experimentalParseClassName?: TwMergeConfigExt["experimentalParseClassName"];
  theme: NonNullable<NonNullable<TwMergeConfigExt["extend"]>["theme"]>;
  classGroups: NonNullable<
    NonNullable<TwMergeConfigExt["extend"]>["classGroups"]
  >;
  conflictingClassGroupModifiers: NonNullable<
    NonNullable<TwMergeConfigExt["extend"]>["conflictingClassGroupModifiers"]
  >;
  conflictingClassGroups: NonNullable<
    NonNullable<TwMergeConfigExt["extend"]>["conflictingClassGroups"]
  >;
  orderSensitiveModifiers: NonNullable<
    NonNullable<TwMergeConfigExt["extend"]>["orderSensitiveModifiers"]
  >;
};

/**
 * @internal
 */
export const validatorPropsTwMerge = (
  options: OptionsMergeTwClsV3
): ValidatorTwMergeReturn => {
  if (!isPlainObject(options)) options = {};
  let {
    config,
    prefix,
    extend,
    override,
    cacheSize,
    experimentalParseClassName
  } = options;

  if (!isPlainObject(config)) config = {};
  if (!isPlainObject(extend)) extend = {};
  if (!isPlainObject(override)) override = {};
  if (!isNumber(cacheSize)) cacheSize = undefined;
  if (!isNonEmptyString(prefix)) prefix = undefined;
  if (!isFunction(experimentalParseClassName))
    experimentalParseClassName = undefined;

  const theme = extend.theme ?? {};
  const classGroups = extend.classGroups ?? {};
  const conflictingClassGroupModifiers =
    extend.conflictingClassGroupModifiers ?? {};

  const conflictingClassGroups = extend.conflictingClassGroups ?? {};
  const orderSensitiveModifiers =
    extend.orderSensitiveModifiers &&
    isNonEmptyArray(extend.orderSensitiveModifiers)
      ? extend.orderSensitiveModifiers
      : [];

  return {
    config,
    override,
    cacheSize,
    prefix,
    experimentalParseClassName,
    theme,
    classGroups,
    conflictingClassGroupModifiers,
    conflictingClassGroups,
    orderSensitiveModifiers
  };
};
