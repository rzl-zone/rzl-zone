import type { OptionsRandomStr } from "./_private/randomSTR.types";

import { joinLines } from "@rzl-zone/build-tools/utils";

import { createMessage } from "@/_private/logger";

import { isNaN } from "@/predicates/is/isNaN";
import { isInteger } from "@/predicates/is/isInteger";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { randomInt } from "../integer/randomInt";

/** -----------------------------------------------------------------------------------
 * * ***Utility: `randomStr`.***
 * ------------------------------------------------------------------------------------
 * **Generates a random alphanumeric string or number with a specified length range.**
 *
 * ---
 * @description
 * This function allows you to generate random strings or numbers with fully
 * customizable options, such as length range, character sets, inclusion of
 * additional characters, and whether to avoid whitespace.
 *
 * ---
 * @param {OptionsRandomStr} [options] - Configuration options for generating the string.
 * @param {OptionsRandomStr["minLength"]} [options.minLength=40] - Minimum length of the generated string (must be `≥` `1`).
 * @param {OptionsRandomStr["maxLength"]} [options.maxLength=40] - Maximum length of the generated string (must be `≤` `5000`).
 * @param {OptionsRandomStr["type"]} [options.type="string"] - Whether to generate a general alphanumeric string or purely numeric string.
 * @param {OptionsRandomStr["avoidWhiteSpace"]} [options.avoidWhiteSpace=true] - If true, removes all whitespace, tabs, and newlines from the character set before generating.
 * @param {OptionsRandomStr["replaceGenStr"]} [options.replaceGenStr] - A custom character set to use when `type` is `"string"`.
 * @param {OptionsRandomStr["replaceGenInt"]} [options.replaceGenInt] - A custom character set to use when `type` is `"number"`.
 * @param {OptionsRandomStr["addChar"]} [options.addChar] - Additional characters to always include in the character set.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if provided options are invalid (such as minLength > maxLength, invalid type, or empty character set).
 *
 * ---
 * @returns {string} The randomly generated string or numeric string of the desired length.
 *
 * ---
 * @example
 * randomStr();
 * // ➔ Generates a 40-character random alphanumeric string
 * randomStr({ minLength: 10, maxLength: 20 });
 * // ➔ Generates a string between 10 and 20 characters
 * randomStr({ type: "number", minLength: 5, maxLength: 5 });
 * // ➔ "48302"
 * randomStr({ replaceGenStr: "ABC ", avoidWhiteSpace: false });
 * // ➔ String using A, B, C and space
 * randomStr({ addChar: "!@#", minLength: 15, maxLength: 15 });
 * // ➔ Guaranteed to include !@# in the set
 */
export const randomStr = (options?: OptionsRandomStr): string => {
  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) options = {};

  const {
    minLength = 40,
    maxLength = 40,
    type = "string",
    avoidWhiteSpace = true
  } = options;

  // Validate `avoidWhiteSpace`
  assertIsBoolean(avoidWhiteSpace, {
    message({ currentType, validType }) {
      return errorMsg(
        `Parameters \`avoidWhiteSpace\` property of the \`options\` (first-parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });

  // Validate `minLength` & `maxLength` type
  if (!isInteger(minLength) || !isInteger(maxLength)) {
    throw new TypeError(
      errorMsg(
        `Parameters \`minLength\` and \`maxLength\` must be of type \`integer-number\`, but received: ['minLength': \`${getPreciseType(
          minLength
        )}\` - (with value: ${safeStableStringify(minLength, {
          keepUndefined: true
        })}), 'maxLength': \`${getPreciseType(
          maxLength
        )}\` - (with value: ${safeStableStringify(maxLength, {
          keepUndefined: true
        })})].`
      )
    );
  }

  // Validate `minLength` & `maxLength` range.
  if (minLength < 1 || maxLength > 5000 || minLength > maxLength) {
    throw new RangeError(
      errorMsg(
        `Invalid range at parameters \`minLength\` must be ≥ 1, \`maxLength\` must be ≤ 5000, and \`minLength\` ≤ \`maxLength\`, but received: ['minLength': \`${minLength}\`, 'maxLength': \`${maxLength}\`].`
      )
    );
  }

  // Validate `type` value props (is not typeof)
  if (type !== "string" && type !== "number") {
    throw new TypeError(
      errorMsg(
        `Parameter \`type\` must be of type \`string\` with value one of "string" | "number", but received: \`${getPreciseType(
          type
        )}\`, with value: ${safeStableStringify(type, {
          keepUndefined: true
        })}.`
      )
    );
  }

  // Generate a random length within the range
  const length = randomInt(minLength, maxLength);

  // Function to clean characters based on `avoidWhiteSpace`
  const cleanCharacters = (charSet: string) => {
    return avoidWhiteSpace ? charSet.replace(/\s|\n|\t/g, "") : charSet;
  };

  // Define character sets
  const defaultNumberSet = "0123456789";
  const defaultStringSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const baseCharSet =
    type === "number"
      ? ((!isNaN(Number(options.replaceGenInt))
          ? options.replaceGenInt
          : undefined) ?? defaultNumberSet)
      : ((options.replaceGenStr ? options.replaceGenStr : undefined) ??
        defaultStringSet);

  // Get the final character set
  const characterSet = cleanCharacters(baseCharSet) + (options.addChar || "");

  // Ensure characterSet is not empty
  if (!characterSet.length) {
    const errCharSet = (() => {
      if (type === "number") {
        if (avoidWhiteSpace) {
          return "If `avoidWhiteSpace` is true, and `replaceGenInt` cant be empty-string value, ensure `replaceGenInt` has valid characters and non-nan string number.";
        }
        return "Ensure `replaceGenInt` has valid characters and not a NaN number string while convert to number.";
      }
      return "Ensure `replaceGenStr` has valid characters and non empty string.";
    })();

    throw new Error(
      errorMsg(joinLines("Character set is empty.", `  > ${errCharSet}`))
    );
  }

  // Generate random string
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length)
    );
  }

  return result;
};

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("randomStr", msg);
