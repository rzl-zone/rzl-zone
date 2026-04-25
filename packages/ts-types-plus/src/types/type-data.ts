/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NodeBuiltins } from "@/types/node";
import type { AnyFunction } from "./functions";

/** --------------------------------------------------
 * * ***Utility Type: `DataTypes`.***
 * --------------------------------------------------
 * **Represents a broad union of commonly used JavaScript data types.**
 * - ✅ ***Includes:***
 *     - `Primitive-Types`.
 *     - `object`.
 *     - `null`.
 *     - `undefined`.
 *     - `symbol`.
 *     - `Any-Function` signature.
 * @example
 * ```ts
 * function isValidType(value: DataTypes): boolean {
 *   return value !== undefined && value !== null;
 * }
 * ```
 */
export type DataTypes =
  | bigint
  | boolean
  | AnyFunction
  | null
  | number
  | object
  | string
  | symbol
  | undefined;

/** --------------------------------------------------
 * * ***Utility Type: `DeepReplaceType`.***
 * --------------------------------------------------
 * **Recursively traverses an array, tuple, or object (including nested structures)
 * and replaces all values of type `Target` with `NewType`.**
 * - ✅ Useful for remapping deeply nested arrays, tuples, or records.
 * @template Arr - The input array, tuple, or object.
 * @template Target - The type to match and replace.
 * @template NewType - The new type to assign to matched values.
 * @example
 * ```ts
 * // Simple tuple
 * type A = [number, string, [number]];
 * type B = DeepReplaceType<A, number, boolean>;
 * // ➔ [boolean, string, [boolean]]
 *
 * // Nested object
 * type Obj = { a: number; b: { c: number; d: string } };
 * type ObjReplaced = DeepReplaceType<Obj, number, boolean>;
 * // ➔ { a: boolean; b: { c: boolean; d: string } }
 *
 * // Mixed array and object
 * type Mixed = [{ x: number }, { y: string, z: number[] }];
 * type MixedReplaced = DeepReplaceType<Mixed, number, boolean>;
 * // ➔ [{ x: boolean }, { y: string, z: boolean[] }]
 * ```
 */
export type DeepReplaceType<Arr, Target, NewType> = Arr extends Target
  ? NewType
  : Arr extends object
    ? { [K in keyof Arr]: DeepReplaceType<Arr[K], Target, NewType> }
    : Arr;

/** --------------------------------------------------
 * * ***Utility Type: `TypedArray`.***
 * --------------------------------------------------
 * **Represents all JavaScript **TypedArray** types used for binary data manipulation.**
 * - ✅ ***Includes:***
 *     - `Int8Array`.
 *     - `Uint8Array`.
 *     - `Uint8ClampedArray`.
 *     - `Int16Array`.
 *     - `Uint16Array`.
 *     - `Int32Array`.
 *     - `Uint32Array`.
 *     - `Float32Array`.
 *     - `Float64Array`.
 *     - `BigInt64Array`.
 *     - `BigUint64Array`.
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/** --------------------------------------------------
 * * ***Utility Type: `WebApiObjects`.***
 * --------------------------------------------------
 * **Represents common **Web API objects** available in the browser.**
 * - ✅ ***Includes:***
 *     - URL: `URL`, `URLSearchParams`.
 *     - Networking: `Request`, `Response`, `Headers`, `WebSocket`.
 *     - Streams: `ReadableStream`, `WritableStream`, `TransformStream`.
 *     - Events: `Event`, `CustomEvent`, `MessageChannel`, `MessagePort`, `MessageEvent`.
 *     - DOM: `HTMLElement`, `Node`, `Document`, `Window`, `CanvasRenderingContext2D`.
 *     - Encoding: `TextEncoder`, `TextDecoder`.
 *     - File: `File`, `FileList`, `ImageBitmap`, `FormData`.
 *     - Abort: `AbortController`, `AbortSignal`.
 *     - Crypto: `CryptoKey`.
 */
export type WebApiObjects =
  | URL
  | URLSearchParams
  | FormData
  | Headers
  | Response
  | Request
  | ReadableStream<any>
  | WritableStream<any>
  | TransformStream<any, any>
  | MessageChannel
  | MessagePort
  | MessageEvent
  | Event
  | CustomEvent
  | HTMLElement
  | Node
  | Document
  | Window
  | AbortController
  | AbortSignal
  | TextEncoder
  | TextDecoder
  | CryptoKey
  | File
  | FileList
  | ImageBitmap
  | CanvasRenderingContext2D
  | WebSocket;

/** --------------------------------------------------
 * * ***Utility Type: `IntlObjects`.***
 * --------------------------------------------------
 * **Represents all **ECMAScript Internationalization API** objects from `Intl`.**
 * - ✅ ***Includes:***
 *     - `Intl.Collator`.
 *     - `Intl.DateTimeFormat`.
 *     - `Intl.NumberFormat`.
 *     - `Intl.RelativeTimeFormat`.
 *     - `Intl.PluralRules`.
 *     - `Intl.ListFormat`. (if environment is supported).
 *     - `Intl.Locale`. (if environment is supported).
 */
export type IntlObjects = {
  [K in keyof typeof Intl]: (typeof Intl)[K] extends abstract new (
    ...args: any[]
  ) => infer R
    ? R
    : never;
}[keyof typeof Intl];
// | Intl.Collator
// | Intl.DateTimeFormat
// | Intl.NumberFormat
// | Intl.RelativeTimeFormat
// | Intl.PluralRules
// | If<IsAny<Intl.ListFormat>, never, Intl.ListFormat>
// | If<IsAny<Intl.Locale>, never, Intl.Locale>;

/** --------------------------------------------------
 * * ***Utility Type: `BoxedPrimitivesTypes`.***
 * --------------------------------------------------
 * **Represents JavaScript **boxed primitive objects** (object wrappers for primitive values).**
 * @description
 * Boxed primitives are created using the `new` keyword on primitive wrapper constructors.
 * - ✅ ***Includes (object wrappers):***
 *     - `new Number(123)` ➔ `Number`.
 *     - `new String("hello")` ➔ `String`.
 *     - `new Boolean(true)` ➔ `Boolean`.
 * - ❌ ***Excludes (primitive values):***
 *     - `123` ➔ `number`.
 *     - `"hello"` ➔ `string`.
 *     - `true` ➔ `boolean`.
 * - ℹ️ ***Note:***
 *     - These are **rarely used directly** in modern **JavaScript/TypeScript**.
 *     - However, they exist for completeness and are sometimes relevant
 *       when distinguishing between **primitive values** and **object wrappers**.
 * @example
 * ```ts
 * const a: BoxedPrimitivesTypes = new Number(123);
 * // ➔ ✅ valid
 * const b: BoxedPrimitivesTypes = new String("abc");
 * // ➔ ✅ valid
 * const c: BoxedPrimitivesTypes = new Boolean(false);
 * // ➔ ✅ valid
 *
 * // ❌ Not allowed (primitive values):
 * const x: BoxedPrimitivesTypes = 123;
 * const y: BoxedPrimitivesTypes = "abc";
 * const z: BoxedPrimitivesTypes = true;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export type BoxedPrimitivesTypes = Number | String | Boolean;

/** --------------------------------------------------
 * * ***Utility Type: `NonPlainObject`.***
 * --------------------------------------------------
 * **Represents all known **non-plain object types**,
 * i.e., values that are **not** considered a `"plain object"` (`{ [key: string]: any }`).**
 * - ✅ ***Includes:***
 *     - **Functions**.
 *     - **Arrays**.
 *     - **Native objects:** `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, `WeakSet`.
 *     - **Built-in classes & APIs:** `Promise`, `Error`, `ArrayBuffer`, `DataView`.
 *     - **Typed arrays:** `TypedArray`.
 *     - **Browser & Node APIs:** `WebApiObjects`, `IntlObjects`, `NodeBuiltins`.
 *     - **Symbols**.
 *     - **Proxies** (wrapping any object).
 *     - The global **`Reflect`** object.
 * - ❌ ***Excludes:***
 *     - Plain objects (`{ foo: string }`, `Record<string, any>`), `null` and `undefined`.
 * - ℹ️ ***Note:***
 *     - Use this type when you need to differentiate **plain objects** from **all other object-like values**.
 * @example
 * ```ts
 * type A = NonPlainObject;
 *
 * const x: A = new Date();
 * // ➔ ✅ Allowed
 * const y: A = [1, 2, 3];
 * // ➔ ✅ Allowed
 * const z: A = Promise.resolve(123);
 * // ➔ ✅ Allowed
 *
 * // ❌ Not allowed (plain object):
 * // const bad: A = { foo: "bar" };
 * ```
 */
export type NonPlainObject =
  | BoxedPrimitivesTypes
  | AnyFunction
  | Promise<any>
  | Array<any>
  | AnObjectNonArray;

/** --------------------------------------------------
 * * ***Utility Type: `AnObjectNonArray`.***
 * --------------------------------------------------
 * **Represents all **non-null, non-array, object-like values** in JavaScript/Node.js.**
 * - ✅ ***Includes:***
 *     - **Built-in objects:** `Date`, `RegExp`, `Error`, `ArrayBuffer`, `DataView`.
 *     - **Collections:** `Map`, `Set`, `WeakMap`, `WeakSet`.
 *     - **Typed arrays:**
 *       `Int8Array`, `Uint8Array`, `Uint8ClampedArray`,
 *       `Int16Array`, `Uint16Array`,
 *       `Int32Array`, `Uint32Array`,
 *       `Float32Array`, `Float64Array`,
 *       `BigInt64Array`, `BigUint64Array`.
 *     - **Browser Web APIs:**
 *       `URL`, `URLSearchParams`, `FormData`, `Headers`, `Response`, `Request`,
 *       `ReadableStream`, `WritableStream`, `TransformStream`,
 *       `MessageChannel`, `MessagePort`, `MessageEvent`,
 *       `Event`, `CustomEvent`, `HTMLElement`, `Node`, `Document`, `Window`,
 *       `CanvasRenderingContext2D`,
 *       `AbortController`, `AbortSignal`,
 *       `TextEncoder`, `TextDecoder`,
 *       `CryptoKey`, `File`, `FileList`, `ImageBitmap`, `WebSocket`.
 *     - **ECMAScript Internationalization API objects:**
 *       `Intl.Collator`, `Intl.DateTimeFormat`, `Intl.NumberFormat`,
 *       `Intl.RelativeTimeFormat`, `Intl.PluralRules`,
 *       `Intl.ListFormat`, `Intl.Locale`.
 *     - **Node.js built-ins:** `Buffer`.
 *     - **Symbols**.
 *     - **Proxies** (wrapping any object).
 *     - The global **`Reflect`** object.
 * - ❌ ***Excludes:***
 *     - `null`.
 *     - Arrays (`[]`, `new Array()`).
 * - ℹ️ ***Note:***
 *     - Use this type when you need to represent **any object-like value except arrays and `null`**.
 * @example
 * ```ts
 * const a: AnObjectNonArray = new Date();
 * const b: AnObjectNonArray = new Map();
 * const c: AnObjectNonArray = Symbol("id");
 *
 * // ❌ These are NOT allowed:
 * // const x: AnObjectNonArray = null;
 * // const y: AnObjectNonArray = [];
 * ```
 */
export type AnObjectNonArray =
  | Date
  | RegExp
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | Error
  | ArrayBuffer
  | DataView
  | TypedArray
  | WebApiObjects
  | IntlObjects
  | NodeBuiltins
  | symbol
  | { [Symbol.toStringTag]: "Proxy" }
  | typeof Reflect;
