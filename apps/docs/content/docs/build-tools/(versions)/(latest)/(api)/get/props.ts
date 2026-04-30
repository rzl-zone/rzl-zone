import type { GetPackageJsonOptions } from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! getPackageJson
/** @version 0.0.7 */
export type GetPackageJson = Prettify<
  {
    /** **Optional configuration:**
     *
     * - [`cwd`](#cwd): Working directory of the target project.
     *
     * @default { cwd: process.cwd(); }
     * @link [`GetPackageJsonOptions-options`](#options)
     */
    options?: GetPackageJsonOptions;
  },
  { recursive: true }
>;
