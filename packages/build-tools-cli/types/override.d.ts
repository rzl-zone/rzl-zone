// import { CLI_CONTEXT } from "@/_private/internal";
import "@rzl-zone/build-tools";

declare module "@rzl-zone/build-tools" {
  /** ----------------------------------------------------------------
   * * ***Special Internal options props.***
   * ----------------------------------------------------------------
   */
  export interface InternalOptions {
    /** ----------------------------------------------------------------
     * * ***Command title / identifier.***
     * ----------------------------------------------------------------
     *
     * Used internally to identify the active command name.
     *
     * - ***This value is primarily used for:***
     *    - Displaying the command name in version or header output
     *    - Rendering consistent command titles / banners
     *    - Differentiating multiple command entry points within the same package
     *
     * ⚠️ Internal usage only — not intended for public configuration.
     *
     * @internal
     */
    __commandTitle?: string;
  }
}
