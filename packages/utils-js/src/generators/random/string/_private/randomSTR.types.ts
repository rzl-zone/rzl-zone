export type OptionsRandomStr = {
  /** ***Ensures no whitespace characters in the generated string, defaultValue: `true`.***
   * @default true
   */
  avoidWhiteSpace?: boolean;
  /** ***Custom characters to replace the default number set if `type` is `"number"`, defaultValue: `undefined`.***
   * @default undefined
   */
  replaceGenInt?: string;
  /** ***Custom characters to replace the default string set if `type` is `"string"`, defaultValue: `undefined`.***
   * @default undefined
   */
  replaceGenStr?: string;
  /** ***Additional characters to include in the generated string, defaultValue: `undefined`.***
   * @default undefined
   */
  addChar?: string;
  /** ***Minimum length of the generated string (1 to 5000), defaultValue: `40`.***
   * @default 40
   */
  minLength?: number;
  /** ***Maximum length of the generated string (1 to 5000), defaultValue: `40`.***
   * @default 40
   */
  maxLength?: number;
  /** ***Type of output: `"string"` or `"number"`, defaultValue: `"string"`.***
   * @default "string"
   */
  type?: "string" | "number";
};

export type RandomSTRProps = {
  /** ***Forcing un-replacing whitespace, defaultValue: `true`.***
   * @default true
   */
  forceNoWhiteSpace?: false;
  /** ***Replacing default randomly generated number if type is "number", defaultValue: `undefined`.***
   * @default undefined
   */
  replaceGenInt?: string;
  /** ***Replacing default randomly generated string if type is "string", defaultValue: `undefined`.***
   * @default undefined
   */
  replaceGenStr?: string;
  /** ***Add new push randomly generated characters, defaultValue: `undefined`.***
   * @default undefined
   */
  addChar?: string;
  /** ***Minimal `1` maximal `5000` as number, defaultValue: `40`.***
   * @default 40
   */
  length?: number;
  /** ***Represents of result generating as string or number, defaultValue: `"string"`.***
   * @default "string"
   */
  type?: "string" | "number";
};
