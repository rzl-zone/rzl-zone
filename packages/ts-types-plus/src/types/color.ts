import type { AndArr } from "./and";
import type { IsBetween } from "./is-between";
import type { ExtendsArr } from "./extends";
import type { If } from "./if";
import type { IsNever } from "./never";
import type { Not } from "./not";
import type { IsInteger } from "./number";
import type { Split } from "./split";
import type { StringLength } from "./string-length";

type _IsValidRGBParameter<T extends number> =
  IsInteger<T> extends true ? IsBetween<T, 0, 255> : false;

/** * ***Configuration options for a type-level utility
 * {@link RGB | `RGB`} | {@link IsRGB | `IsRGB` } | {@link IfRGB | `IfRGB` }.*** */
export type RGBOptions = {
  /** * ***Separator character(s) used between the RGB components (`r`, `g`, `b`).***
   *
   * - **For example:**
   *      - `","` ➔ `"rgb(23,242,0)"`.
   *      - `", "` ➔ `"rgb(23, 242, 0)"`.
   *
   * @default ", "
   */
  separator: string;
};

/** * ***Default configuration for the {@link RGBOptions | `RGBOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultRGBOptions;
 * // ➔ { separator: ", " }
 * ```
 */
export type DefaultRGBOptions = {
  /** * ***Default separator for RGB components.***
   *
   * **Produces strings like `"rgb(23, 242, 0)"`.**
   */
  separator: ", ";
};

/** -------------------------------------------------------
 * * ***Utility Type: `RGB`.***
 * -------------------------------------------------------
 * **A type-level utility that validates an **RGB color string**.**
 * - **Behavior:**
 *      - Accepts `rgb(r, g, b)` format with customizable separators.
 *      - Each parameter `r`, `g`, `b` must be an integer between `0` and `255`.
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = RGB<"rgb(23, 242, 0)">;
 * // ➔ "rgb(23, 242, 0)"
 * type B = RGB<"rgb(324, 123, 3)">;
 * // ➔ never
 * type C = RGB<"rgb(23,242,0)", { separator: "," }>;
 * // ➔ "rgb(23,242,0)"
 * ```
 */
export type RGB<
  T extends string,
  Options extends RGBOptions = DefaultRGBOptions
> = T extends `rgb(${infer R extends number}${Options["separator"]}${infer G extends number}${Options["separator"]}${infer B extends number})`
  ? AndArr<
      [
        _IsValidRGBParameter<R>,
        _IsValidRGBParameter<G>,
        _IsValidRGBParameter<B>
      ]
    > extends true
    ? T
    : never
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `IsRGB`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **RGB color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IsRGB<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IsRGB<"rgb(324, 123, 3)">;
 * // ➔ false
 * type C = IsRGB<"rgb(23,242,0)", { separator: "," }>;
 * // ➔ true
 * ```
 */
export type IsRGB<
  T extends string,
  Options extends RGBOptions = DefaultRGBOptions
> = Not<IsNever<RGB<T, Options>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfRGB`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **RGB color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IfRGB<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IfRGB<"rgb(23, 242, 0)", "valid">;
 * // ➔ "valid"
 * type C = IfRGB<"rgb(324, 123, 3)", "valid", "invalid">;
 * // ➔ "invalid"
 * type D = IfRGB<"rgb(23,242,0)", true, false { separator: "," }>;
 * // ➔ true
 * ```
 */
export type IfRGB<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  Options extends RGBOptions = DefaultRGBOptions
> = If<IsRGB<T, Options>, IfTrue, IfFalse>;

type _ValidHEXCharacters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
];

type _AllowedHEXLength = 3 | 4 | 6 | 8;

/** -------------------------------------------------------
 * * ***Utility Type: `HEX`.***
 * -------------------------------------------------------
 * **A type-level utility that validates a **HEX color string**.**
 * - **Behavior:**
 *      - Accepts `#RGB`, `#RGBA`, `#RRGGBB`, or `#RRGGBBAA` formats.
 *      - Characters must be `[0-9A-F]` (**case-insensitive**).
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @example
 * ```ts
 * type A = HEX<"#000">;      // ➔ "#000"
 * type B = HEX<"#g00">;      // ➔ never
 * type C = HEX<"#0000">;     // ➔ "#0000"
 * type D = HEX<"#00000">;    // ➔ never
 * type E = HEX<"#000000">;   // ➔ "#000000"
 * type F = HEX<"#00000000">; // ➔ "#00000000"
 * ```
 */
export type HEX<T extends string> = (
  Uppercase<T> extends `#${infer HEXWithoutHashTag extends string}`
    ? StringLength<HEXWithoutHashTag> extends _AllowedHEXLength
      ? ExtendsArr<Split<HEXWithoutHashTag, "">, _ValidHEXCharacters[number]>
      : false
    : false
) extends true
  ? T
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `IsHEX`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **HEX color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @example
 * ```ts
 * type A = IsHEX<"#000">; // ➔ true
 * type B = IsHEX<"#g00">; // ➔ false
 * ```
 */
export type IsHEX<T extends string> = Not<IsNever<HEX<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfHEX`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **HEX color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @example
 * ```ts
 * type A = IfHEX<"#000">;
 * // ➔ true
 * type B = IfHEX<"#g00">;
 * // ➔ false
 * type C = IfHEX<"#0000", "valid">;
 * // ➔ "valid"
 * type D = IfHEX<"#00000", "valid","invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfHEX<T extends string, IfTrue = true, IfFalse = false> = If<
  IsHEX<T>,
  IfTrue,
  IfFalse
>;

/** * ***Configuration options for a type-level utility
 * {@link HSL | `HSL` } | {@link IsHSL | `IsHSL` } | {@link IfHSL | `IfHSL` }.*** */
export type HSLOptions = {
  /** * ***Separator character(s) used between the HSL components (`h`, `s`, `l`).***
   *
   * - **For example:**
   *      - `","` ➔ `"hsl(180,100%,50%)"`.
   *      - `", "` ➔ `"hsl(180, 100%, 50%)"`.
   *
   * @default ", "
   */
  separator: string;
};

/** * ***Default configuration for the {@link HSLOptions | `HSLOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultHSLOptions;
 * // ➔ { separator: ", " }
 * ```
 */
export type DefaultHSLOptions = {
  /** * ***Default separator for HSL components.***
   *
   * **Produces strings like `"hsl(180, 100%, 50%)"`.**
   */
  separator: ", ";
};

/** -------------------------------------------------------
 * * ***Utility Type: `HSL`.***
 * -------------------------------------------------------
 * **A type-level utility that validates an **HSL color string**.**
 * - **Behavior:**
 *      - Accepts `hsl(h, s%, l%)` format with customizable separators.
 *      - `h` must be an integer, `s` and `l` must be integers between `0` and `100`.
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = HSL<"hsl(100, 34%, 56%)">;
 * // ➔ "hsl(100, 34%, 56%)"
 * type B = HSL<"hsl(100, 200%, 3)">;
 * // ➔ never
 * type C = HSL<"hsl(100,34%,56%)", { separator: "," }>;
 * // ➔ "hsl(100,34%,56%)"
 * ```
 */
export type HSL<
  T extends string,
  Options extends HSLOptions = DefaultHSLOptions
> = (
  T extends `hsl(${infer H extends number}${Options["separator"]}${infer S extends number}%${Options["separator"]}${infer L extends number}%)`
    ? AndArr<[IsInteger<H>, IsInteger<S>, IsInteger<L>]> extends true
      ? AndArr<[IsBetween<S, 0, 100>, IsBetween<L, 0, 100>]>
      : false
    : false
) extends true
  ? T
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `IsHSL`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **HSL color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IsHSL<"hsl(100, 34%, 56%)">;
 * // ➔ true
 * type B = IsHSL<"hsl(101, 200%, 3)">;
 * // ➔ false
 * type C = IsHSL<"hsl(100,34%,56%)", { separator: "," }>;
 * // ➔ true
 * ```
 */
export type IsHSL<
  T extends string,
  Options extends HSLOptions = DefaultHSLOptions
> = Not<IsNever<HSL<T, Options>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfHSL`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **HSL color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IfHSL<"hsl(100, 34%, 56%)", "ok">;
 * // ➔ "ok"
 * type B = IfHSL<"hsl(101, 200%, 3)", "ok", "fail">;
 * // ➔ "fail"
 * type C = IfHSL<"hsl(100,34%,56%)", true, false, { separator: "," }>;
 * // ➔ true
 * ```
 */
export type IfHSL<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  Options extends HSLOptions = DefaultHSLOptions
> = If<IsHSL<T, Options>, IfTrue, IfFalse>;

/** * ***High-level configuration for {@link Color | `Color`} parsing utilities.***
 *
 * **Allows customizing **RGB** and **HSL** parsing behavior independently.**
 */
export type ColorOptions = {
  /** * ***Options for handling RGB color strings.***
   *
   * - **Behavior:**
   *      - Controls parsing and formatting behavior of RGB values.
   *      - By default uses {@link DefaultRGBOptions | **`DefaultRGBOptions`**}.
   * @default DefaultRGBOptions
   * @example
   * ```ts
   * type Opt = ColorOptions["rgbOptions"];
   * // ➔ { separator: string }
   *
   * // with defaults applied:
   * type Opt = DefaultRGBOptions;
   * // ➔ { separator: ", " }
   * ```
   */
  rgbOptions?: RGBOptions;

  /** * ***Options for handling HSL color strings.***
   *
   * - **Behavior:**
   *      - Controls parsing and formatting behavior of HSL values.
   *      - By default uses {@link DefaultHSLOptions | **`DefaultHSLOptions`**}.
   * @default DefaultHSLOptions
   * @example
   * ```ts
   * type Opt = ColorOptions["hslOptions"];
   * // ➔ { separator: string }
   *
   * // with defaults applied:
   * type Opt = DefaultHSLOptions;
   * // ➔ { separator: ", " }
   * ```
   */
  hslOptions?: HSLOptions;
};

/** * ***Default configuration for the {@link ColorOptions |`ColorOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultColorOptions;
 * // ➔ { rgbOptions: { separator: ", " }, hslOptions: { separator: ", " } }
 * ```
 */
export type DefaultColorOptions = {
  /** * ***Default configuration for `RGBOptions`.***
   *
   * - **Behavior:**
   *      - Provides the default separator for RGB strings.
   *      - By default: `", "`
   * @example
   * ```ts
   * type RGBOpt = DefaultColorOptions["rgbOptions"];
   * // ➔ { separator: ", " }
   * ```
   */
  rgbOptions: DefaultRGBOptions;
  /** * ***Default configuration for `HSLOptions`.***
   *
   * - **Behavior:**
   *      - Provides the default separator for HSL strings.
   *      - By default: `", "`
   * @example
   * ```ts
   * type HSLOpt = DefaultColorOptions["hslOptions"];
   * // ➔ { separator: ", " }
   * ```
   */
  hslOptions: DefaultHSLOptions;
};

type ResolveRGBOptions<O extends ColorOptions> =
  O["rgbOptions"] extends RGBOptions ? O["rgbOptions"] : DefaultRGBOptions;

type ResolveHSLOptions<O extends ColorOptions> =
  O["hslOptions"] extends HSLOptions ? O["hslOptions"] : DefaultHSLOptions;

/** -------------------------------------------------------
 * * ***Utility Type: `Color`.***
 * -------------------------------------------------------
 * - **A type-level utility that validates a string as a **Color** in:**
 *      - **`RGB`**.
 *      - **`HEX`**.
 *      - **`HSL`**.
 * @returns {T} Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options to pass down to `RGB`/`HSL` validation.
 * @example
 * ```ts
 * type A = Color<"rgb(23, 242, 0)">;
 * // ➔ "rgb(23, 242, 0)"
 * type B = Color<"rgb(324, 123, 3)">;
 * // ➔ never
 * type C = Color<"#000000">;
 * // ➔ "#000000"
 * type D = Color<"hsl(100,34%,56%)", { hslOptions: { separator: "," }}>;
 * // ➔ "hsl(100,34%,56%)"
 * ```
 */
export type Color<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions
> =
  | HEX<T>
  | HSL<T, ResolveHSLOptions<Options>>
  | RGB<T, ResolveRGBOptions<Options>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsColor`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **Color**
 * (`RGB` | `HEX` | `HSL`).**
 * @returns {T} - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options to pass down to RGB/HSL validation.
 * @example
 * ```ts
 * type A = IsColor<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IsColor<"rgb(324, 123, 3)">;
 * // ➔ false
 * type C = IsColor<"#000000">;
 * // ➔ true
 * type D = IsColor<"hsl(100,34%,56%)", { hslOptions: { separator: "," } }>;
 * // ➔ true
 * ```
 */
export type IsColor<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions
> = Not<IsNever<Color<T, Options>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfColor`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **Color**
 * (`RGB` | `HEX` | `HSL`), otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options to pass down to RGB/HSL validation.
 * @example
 * ```ts
 * type A = IfColor<"rgb(23, 242, 0)", { rgbOptions: { separator: ", " }}, "valid">;
 * // ➔ "valid"
 * type B = IfColor<"rgb(324, 123, 3)", DefaultColorOptions, "valid","invalid">;
 * // ➔ "invalid"
 * type C = IfColor<"#000000">;
 * // ➔ true
 * ```
 */
export type IfColor<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions,
  IfTrue = true,
  IfFalse = false
> = If<IsColor<T, Options>, IfTrue, IfFalse>;
