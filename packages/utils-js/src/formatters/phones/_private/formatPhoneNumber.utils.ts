import type { OmitStrict, Prettify } from "@rzl-zone/ts-types-plus";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { formatPhoneNumber } from "../formatPhoneNumber";
import {
  AsYouType,
  type PhoneNumber,
  type CountryCode
} from "libphonenumber-js/max";

/** ***Util constants `country code for special leading zero rule` for {@link formatPhoneNumber}.***
 *
 * @internal
 */
export const trunkZeroCountries: Record<string, string> = {
  "7": "Russia, Kazakhstan",
  "20": "Egypt",
  "27": "South Africa",
  "30": "Greece",
  "31": "Netherlands",
  "32": "Belgium",
  "33": "France",
  "34": "Spain",
  "36": "Hungary",
  "39": "Italy, San Marino, Vatican",
  "41": "Switzerland",
  "43": "Austria",
  "44": "United Kingdom",
  "45": "Denmark",
  "46": "Sweden",
  "47": "Norway",
  "48": "Poland",
  "49": "Germany",
  "51": "Peru",
  "52": "Mexico",
  "53": "Cuba",
  "54": "Argentina",
  "55": "Brazil",
  "56": "Chile",
  "57": "Colombia",
  "58": "Venezuela",
  "60": "Malaysia",
  "61": "Australia",
  "62": "Indonesia",
  "63": "Philippines",
  "64": "New Zealand",
  "65": "Singapore",
  "66": "Thailand",
  "81": "Japan",
  "82": "South Korea",
  "84": "Vietnam",
  "86": "China",
  "90": "Turkey",
  "91": "India",
  "92": "Pakistan",
  "351": "Portugal",
  "352": "Luxembourg",
  "355": "Albania",
  "356": "Malta",
  "358": "Finland",
  "359": "Bulgaria",
  "370": "Lithuania",
  "371": "Latvia",
  "372": "Estonia",
  "373": "Moldova",
  "374": "Armenia",
  "375": "Belarus",
  "376": "Andorra",
  "377": "Monaco",
  "378": "San Marino",
  "379": "Vatican",
  "971": "UAE"
};
/** ***Util helper for {@link formatPhoneNumber}.***
 *
 * @internal
 */
export const isValidPhoneE164 = (value: unknown) => {
  if (!isNonEmptyString(value)) return false;
  return (
    /^(\+)?[0-9\s().-]+$/.test(value) && value.replace(/\D/g, "").length <= 15
  );
};

/** ***Util parsing `phone-number` for {@link formatPhoneNumber}.***
 *
 * @internal
 */
export const parsingAsYouType = (
  value: string,
  defaultCountry?: CountryCode
) => {
  let parsed;
  try {
    parsed = new AsYouType(defaultCountry);
    parsed.input(value);
    return parsed;
  } catch {
    parsed?.reset();
    return undefined;
  }
};

type ValidParseAsYouType = Prettify<
  OmitStrict<AsYouType, "getNumber"> & {
    getNumber(): PhoneNumber; // override agar tidak nullable
  }
>;

/** ***Util validation parsing `phone-number` when using `AsYouType` for {@link formatPhoneNumber}.***
 *
 * @internal
 */
export const isValidParseAsYouType = (
  parsedAsYouType?: AsYouType
): parsedAsYouType is ValidParseAsYouType => {
  const parsed = !!parsedAsYouType?.isValid() && !!parsedAsYouType.getNumber();
  return parsed;
};
