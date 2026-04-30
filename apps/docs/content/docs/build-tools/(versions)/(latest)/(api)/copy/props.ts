import type {
  CopyFileToDestOptions,
  CopyFileToDestParam
} from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! copyFileToDest
/** @version 0.0.7 */
export type CopyFileToDest = Prettify<
  {
    /** **The parameter options for copying a file.**
     *
     * A single `CopyFileToDestParam` object, an array, or a Set of `CopyFileToDestParam`.
     *
     * - *When a collection is provided:*
     *     - Each item is validated independently.
     *     - Files are copied sequentially.
     *     - Logging reflects the cumulative copy progress.
     *
     * @default -
     *
     * @link [`CopyFileToDestParam-param`](#param)
     */
    param:
      | Prettify<CopyFileToDestParam>
      | Prettify<CopyFileToDestParam[]>
      | Prettify<Set<CopyFileToDestParam>>;

    /** **Optional configuration:**
     *
     * - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *
     * @default { logLevel: "info"; }
     * @link [`CopyFileToDestOptions-options`](#options)
     */
    options?: CopyFileToDestOptions;
  },
  { recursive: true }
>;
