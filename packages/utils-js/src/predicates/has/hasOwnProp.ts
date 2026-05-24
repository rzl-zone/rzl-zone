import type {
  AnyFunction,
  AnyString,
  IsAny,
  IsStringLiteral
} from "@rzl-zone/ts-types-plus";
import type {
  DeepRequiredSymbolHasOwnProp,
  GuardedHasOwnProp,
  HasOwnPropOptions,
  NestedKeyOfHasOwnProp,
  SmartDetectArrayFuncHasOwnProp,
  SmartDetectUnknownKeyHasOwnProp,
  NumericKeyHasOwnPropMapped,
  NumericKeyOfHasOwnProp,
  SmartDetectStringHasOwnProp
} from "./hasOwnProp.types";

import { createMessage } from "@/_private/logger";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import { isNaN } from "../is/isNaN";
import { isNull } from "../is/isNull";
import { isString } from "../is/isString";
import { isNumber } from "../is/isNumber";
import { isSymbol } from "../is/isSymbol";
import { isFunction } from "../is/isFunction";
import { isUndefined } from "../is/isUndefined";
import { isObjectOrArray } from "../is/isObjectOrArray";
import { isPlainObject, type IsPlainObjectResult } from "../is/isPlainObject";

// ------------------- HAS OWN PROP OVERLOADS -------------------

/** -------------------------------------------------------
 * * ***Type guard: `hasOwnProp`.***
 * --------------------------------------------------------
 * **A **type-safe** replacement for `Object.prototype.hasOwnProperty` with runtime validation and **TypeScript-aware type narrowing**.**
 *
 * ---
 * - #### *Supported Targets:*
 *       - **Plain objects** ➔ `{ foo: "bar" }`.
 *       - **Arrays** ➔ `[ { id: 1 }, { id: 2 } ]`.
 *       - **Strings** ➔ `"hello"` (as array-like objects with `.length`, index, etc.).
 *       - **Functions** ➔ callable objects with extra props.
 *       - **Symbols** ➔ own property symbols.
 *       ---
 * - #### *Key Advantages over `in` or `obj.hasOwnProperty(key)`:*
 *       - Supports **dot/bracket path notation** (e.g. `"user.address.city"`, `"addresses[0].zip"`).
 *       - Handles **symbol** keys safely.
 *       - **Narrows** the type of `obj` in TypeScript (stronger type safety).
 *       - Configurable handling of **`undefined`** and **`null`**.
 *       ---
 * - #### *Runtime Behavior:*
 *       - #### Returns `true` if:
 *            - Value `obj` is an object/array/string/function **and** the property
 *              exists **and**, it passes the `options` checks.
 *            ---
 *       - #### Returns `false` if:
 *            - Value `obj` is not a valid type.
 *            - The property does not exist.
 *            - The value is `undefined` and `discardUndefined: true` (**default**).
 *            - The value is `null` and `discardNull: true`.
 *            - The `key` (after trimming) is an **empty string** ➔ treated as **invalid**.
 *       ---
 * - #### *TypeScript Behavior:*
 *       - #### Inside an `if (hasOwnProp(...)) {}` block:
 *            - The property is **guaranteed to exist**.
 *            - Depending on `options`, the property type is narrowed to exclude
 *              `undefined` and/or `null`.
 *       ---
 * - #### *Caveats:*
 *       - #### Empty keys are invalid:
 *            - If the `key` string is empty (`""`) after trimming whitespace or other characters,
 *              it will **not** be considered a valid property and always returns `false`.
 *            ---
 *       - #### Arrays are limited by TypeScript inference:
 *            - Checking index `[0]` only narrows **that specific index**, not the rest, example:
 *               1. `hasOwnProp(users, "[0].id")` does **not** imply `users[1].id` exists.
 *                   - For different indices, use **optional chaining** (`users[1]?.id`).
 *            ---
 *       - #### Autocomplete limitation for array indices:
 *            - Autocompletion for `[index]` is only supported up to **5** (`[0]` ➔ `[4]`).
 *            - This limit is intentional for **performance and safety:**
 *               1. Generating infinite union types for all possible indices would cause
 *                 **TypeScript IntelliSense to hang or crash**.
 *                   - You can still check higher indices manually (e.g. `"[999].id"`),
 *                     but they will not show up in IntelliSense suggestions.
 *
 * ---
 * @param {HasOwnPropOptions} [options] - ***Optional configuration object.***
 * @param {HasOwnPropOptions["discardUndefined"]} [options.discardUndefined=true]
 *  ***If `true`, properties with `undefined` values are treated as **missing**, default: `true`.***
 * @param {HasOwnPropOptions["discardNull"]} [options.discardNull=false]
 *  ***If `true`, properties with `null` values are treated as **missing**, default: `false`.***
 * @param {*} obj ***The `object`, `array`, `string`, `function`, or `other value` to check against.***
 * @param {PropertyKey} key
 *  ***The property key to check, can be:***
 *    - `string` (supports dot/bracket paths, e.g. `"user.address.city"`, `"[0].id"`).
 *    - `number` (array-like index).
 *    - `symbol` (own property symbols).
 *
 * ---
 * @returns {boolean} Return `true` if the property exists (and passes `options`), otherwise `false`.
 *
 * ---
 * @example
 *
 * - #### Objects:
 *   ```ts
 *   const obj: { name?: string | null } = {};
 *
 *   if (hasOwnProp(obj, "name")) {
 *     // obj is now ➔ { name: string | null }
 *     console.log(obj.name); // string | null
 *   }
 *
 *   if (hasOwnProp(obj, "name", { discardUndefined: true, discardNull: true })) {
 *     // obj is now ➔ { name: string }
 *     console.log(obj.name.toUpperCase()); // safe
 *   }
 *   ```
 * - #### Arrays:
 *   ```ts
 *   const users = [{ id: 1 }, { id: 2 }];
 *
 *   if (hasOwnProp(users, "[1].id")) {
 *     // ➔ users[1].id is guaranteed to exist
 *     console.log(users[1].id); // number
 *   }
 *
 *   // Caveat: narrowing only applies to checked index
 *   if (hasOwnProp(users, "[0].id")) {
 *     console.log(users[0].id); // safe
 *     console.log(users[1].id); // not guaranteed!
 *   }
 *
 *   // Solution: optional chaining
 *   console.log(users[1]?.id);
 *   // ➔ safe, even without narrowing
 *   ```
 *
 * - #### Symbols:
 *   ```ts
 *   const secret = Symbol("secret");
 *   const obj2 = { [secret]: 42 };
 *
 *   if (hasOwnProp(obj2, secret)) {
 *     console.log(obj2[secret] + 1);
 *     // ➔ 43
 *   }
 *   ```
 * - #### Strings:
 *   ```ts
 *   if (hasOwnProp("hello", "length")) {
 *     console.log("hello".length);
 *     // ➔ 5
 *   }
 *
 *   if (hasOwnProp("hello", 1)) {
 *     console.log("hello"[1]);
 *     // ➔ "e"
 *   }
 *   ```
 * - #### Functions:
 *   ```ts
 *   function fn() {}
 *   fn.extra = 123;
 *
 *   if (hasOwnProp(fn, "extra")) {
 *     console.log(fn.extra);
 *     // ➔ 123
 *   }
 *   ```
 * - #### Empty key:
 *   ```ts
 *   const obj = { a: 1 };
 *
 *   hasOwnProp(obj, "");
 *   // ➔ false (invalid key)
 *   hasOwnProp(obj, "   ");
 *   // ➔ false (trimmed to empty)
 *   ```
 */
export function hasOwnProp<Obj>(
  obj: IsAny<Obj> extends true ? Obj : never,
  key: PropertyKey,
  options?: HasOwnPropOptions<boolean, boolean>
  /** @ts-expect-error we force `any` to `unknown` at result */
): obj is unknown;

export function hasOwnProp<Obj extends null | undefined>(
  obj: Obj,
  key: PropertyKey,
  options?: HasOwnPropOptions<boolean, boolean>
): false;

export function hasOwnProp<
  Obj extends object | AnyFunction,
  Key extends NestedKeyOfHasOwnProp<Obj>,
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
>(
  obj: Obj | null | undefined,
  key: Key,
  options?: HasOwnPropOptions<DiscardUndefined, DiscardNull>
  /** @ts-expect-error we force to override recursive type result */
): obj is GuardedHasOwnProp<Obj, Key, DiscardUndefined, DiscardNull>;

export function hasOwnProp<
  Obj extends object,
  Num extends NumericKeyOfHasOwnProp<Obj>,
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
>(
  obj: Obj | null | undefined,
  key: Num,
  options?: HasOwnPropOptions<DiscardUndefined, DiscardNull>
  /** @ts-expect-error we force to override recursive type result */
): obj is NumericKeyHasOwnPropMapped<Obj, Num, DiscardUndefined, DiscardNull>;

export function hasOwnProp<
  Obj extends object | AnyFunction,
  Sym extends symbol,
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
>(
  obj: Obj | null | undefined,
  key: Sym,
  options?: HasOwnPropOptions<DiscardUndefined, DiscardNull>
  /** @ts-expect-error we force to override recursive type result */
): obj is DeepRequiredSymbolHasOwnProp<Obj, Sym, DiscardUndefined, DiscardNull>;

export function hasOwnProp<
  Obj extends string | null | undefined,
  Key extends string | number
>(
  obj: Obj | null | undefined,
  key: Key,
  options?: HasOwnPropOptions<boolean, boolean>
  /** @ts-expect-error we force to override recursive type result */
): obj is IsStringLiteral<SmartDetectStringHasOwnProp<Obj, Key>> extends true
  ? AnyString | SmartDetectStringHasOwnProp<Obj, Key>
  : SmartDetectStringHasOwnProp<Obj, Key>;

export function hasOwnProp<
  Obj extends unknown[] | AnyFunction,
  Key extends PropertyKey
>(
  obj: Obj,
  key: Key,
  options?: HasOwnPropOptions<boolean, boolean>
): obj is SmartDetectArrayFuncHasOwnProp<Obj, Key>;

export function hasOwnProp<
  Obj extends unknown | AnyFunction,
  Key extends PropertyKey,
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
>(
  obj: Obj,
  key:
    | Key
    | "length"
    | (IsPlainObjectResult<Obj> extends never ? never : keyof Obj),
  options?: HasOwnPropOptions<DiscardUndefined, DiscardNull>
  /** @ts-expect-error we force to override recursive type result */
): obj is SmartDetectUnknownKeyHasOwnProp<
  Obj,
  Key,
  DiscardUndefined,
  DiscardNull
>;

// ------------------- IMPLEMENTATION -------------------
export function hasOwnProp(
  obj: unknown,
  key: PropertyKey,
  options: HasOwnPropOptions<boolean, boolean> = {}
): unknown {
  if (!isString(obj) && !isObjectOrArray(obj) && !isFunction(obj)) return false;

  if (!isPlainObject(options)) options = {};

  // defaults: undef ➔ true, null ➔ false
  const discardUndefined =
    options.discardUndefined === undefined ? true : options.discardUndefined;
  const discardNull =
    options.discardNull === undefined ? false : options.discardNull;

  assertIsBoolean(discardUndefined, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Parameter \`discardUndefined\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  assertIsBoolean(discardNull, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Parameter \`discardNull\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  // Parse key ➔ path
  const path: (string | number | symbol)[] = [];
  //todo: keep use manually check for length string value for avoid Maximum infinity loop function.!!!
  if (
    (isString(key) && key.trim().length > 0) ||
    isNumber(key, { includeNaN: true })
  ) {
    const strKey = isNumber(key, { includeNaN: true }) ? String(key) : key;
    strKey.split(".").forEach((k) => {
      const bracketMatch = k.match(/^\[(\d+)\]$/);
      const symbolMatch = k.match(/^Symbol\((.+)\)$/);
      if (bracketMatch) path.push(Number(bracketMatch[1]));
      else if (symbolMatch) path.push(Symbol.for(symbolMatch[1]));
      else if (!isNaN(Number(k))) path.push(Number(k));
      else path.push(k);
    });
  } else if (isSymbol(key)) {
    path.push(key);
  } else {
    return false;
  }

  // Traverse
  let current: unknown =
    isString(obj) && obj.trim().length > 0 ? Object(obj) : obj;
  for (const k of path) {
    if (
      (isString(k) && k.trim().length > 0) ||
      isNumber(k, { includeNaN: true })
    ) {
      if (
        isNull(current) ||
        !Object.prototype.hasOwnProperty.call(current, k)
      ) {
        return false;
      }
      current = (current as Record<PropertyKey, unknown>)[k];
    } else if (isSymbol(k)) {
      if (
        isNull(current) ||
        (typeof current !== "object" && !isFunction(current))
      ) {
        return false;
      }
      const symbols = Object.getOwnPropertySymbols(current);
      const matched = symbols.find(
        (s) => s === k || s.description === k.description
      );
      if (!matched) return false;
      current = (current as Record<PropertyKey, unknown>)[matched];
    } else {
      return false;
    }
  }
  // early fail for undefined if requested
  if (discardUndefined && isUndefined(current)) return false;

  // final null check (only if requested)
  if (discardNull && isNull(current)) return false;

  return true;
}

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("hasOwnProp", msg);
