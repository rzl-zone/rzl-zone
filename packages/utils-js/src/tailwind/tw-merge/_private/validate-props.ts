import type { Config as TwConfig } from "tailwindcss";
import type { ConfigExtension } from "tailwind-merge-v4";

import type { OptionsMergeTwClsV4 } from "../v4/_private/types";

import { hasOwnProp } from "@/predicates/has/hasOwnProp";

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
  options: OptionsMergeTwClsV4
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

  const theme = hasOwnProp(extend, "theme") ? extend.theme : {};
  const classGroups = hasOwnProp(extend, "classGroups")
    ? extend.classGroups
    : {};
  const conflictingClassGroupModifiers = hasOwnProp(
    extend,
    "conflictingClassGroupModifiers"
  )
    ? extend.conflictingClassGroupModifiers
    : {};

  const conflictingClassGroups = hasOwnProp(extend, "conflictingClassGroups")
    ? extend.conflictingClassGroups
    : {};
  const orderSensitiveModifiers =
    hasOwnProp(extend, "orderSensitiveModifiers") &&
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
