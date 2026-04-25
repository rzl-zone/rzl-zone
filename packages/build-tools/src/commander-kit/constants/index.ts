import { deepFreeze } from "@/_internal/utils/helper";

/** ------------------------------------------------------------------------
 * * ***Internal default configuration for the Commander UI layer.***
 * ------------------------------------------------------------------------
 *
 * Centralized constant registry containing baseline values used by
 * the structured UI system when enhancing Commander program instances.
 *
 * - **This object acts as the single source of truth for:**
 *    - Default flag signatures.
 *    - Default help descriptions.
 *    - Any future UI-level fallback values.
 *
 * - **These values are used when:**
 *    - The user does not explicitly override version flags.
 *    - The user does not explicitly override help flags.
 *    - Internal rendering requires safe fallback strings.
 *
 * ------------------------------------------------------------------------
 * #### ⚠️ Internal Contract.
 * ------------------------------------------------------------------------
 *
 * - This constant is not part of the public API.
 * - Its structure may change without notice.
 * - Consumers must not rely on its shape or values.
 *
 * Any external customization should be performed via the
 * public configuration surface (e.g. applyCommanderUi options),
 * not by mutating this object.
 *
 * ------------------------------------------------------------------------
 *
 * @internal
 */
export const COMMANDER_UI_DEFAULTS = deepFreeze({
  FLAGS: {
    /** Default version flag signature.
     *
     * @returns `"-v, --version"`.
     */
    VERSION: "-v, --version",

    /** Default help flag signature.
     *
     * @returns `"-h, --help"`.
     */
    HELP: "-h, --help"
  },

  DESCRIPTIONS: {
    /** Default help option description text.
     *
     * @returns `"To display help for this command."`.
     */
    HELP: "To display help for this command.",
    /** Default version option description text.
     *
     * @returns `"The version package of this command."`.
     */
    VERSION: "The version package of this command."
  }
});
