// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Command } from "commander";

import type {
  CommandContext,
  CommanderInternalState,
  CommanderUiOptions
} from "@/commander-kit/types";
import type { OmitStrict } from "@/_internal/types/extra";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { applyCommanderUi } from "@/commander-kit/ui/apply-commander-ui";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { createBaseProgram } from "@/commander-kit/factories/create-base-program";

import { SymbolSafe } from "@/_internal/utils/symbol";
import { isNonEmptyString } from "@/_internal/utils/helper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CommandBaseProgram } from "@/commander-kit/factories/create-base-program";

/** ------------------------------------------------------------------------
 * * Internal Commander state marker symbol.
 * ------------------------------------------------------------------------
 *
 * Unique symbol used to attach and retrieve internal metadata
 * from Commander program instances.
 *
 * This symbol serves as a hidden state key for native
 * {@link Command | `Command`} instances, allowing the library
 * to store internal lifecycle data without relying on
 * Commander private properties.
 *
 * For {@link createBaseProgram | `createBaseProgram()`} instances and {@link applyCommanderUi | `applyCommanderUi`},
 * internal state is managed directly by the factory and does not
 * rely on symbol attachment.
 *
 * ------------------------------------------------------------------------
 * #### **🔒 Visibility.**
 * ------------------------------------------------------------------------
 *
 * This symbol is strictly internal and is not part of the public API,
 * consumers must not access, mutate, or depend on it.
 *
 * ------------------------------------------------------------------------
 * @internal
 */
export const COMMANDER_INTERNAL_SYMBOL: unique symbol = SymbolSafe(
  "rzl-built-tools:commander.internal"
) as typeof COMMANDER_INTERNAL_SYMBOL;

/** ------------------------------------------------------------------------
 * * Creates a fresh Commander internal state object.
 * ------------------------------------------------------------------------
 *
 * Generates a fully initialized internal state container used to
 * track UI configuration, help metadata, usage overrides,
 * and version interception flags.
 *
 * This state object is attached to a Commander instance
 * (either native or factory-based) and acts as the single source
 * of truth for runtime UI lifecycle behavior.
 *
 * ------------------------------------------------------------------------
 * #### State Responsibilities.
 * ------------------------------------------------------------------------
 *
 * The returned object stores:
 *
 * - UI configuration metadata.
 * - Help option interception data.
 * - Manual `.usage()` overrides.
 * - Version string overrides.
 * - Version injection flags.
 *
 * All properties are initialized to safe defaults.
 *
 * ------------------------------------------------------------------------
 *
 * @returns A fresh {@link CommanderInternalState | `CommanderInternalState`} object.
 *
 * @internal
 */
export function createDefaultInternalState() {
  return {
    ui: undefined,
    help: undefined,
    packageName: undefined,
    manualUsage: undefined,
    disableUsage: false,
    versionMeta: undefined,
    versionInjected: false,
    versionDisable: false,
    versionOriginal: undefined,
    versionSetByUser: false
  } satisfies CommanderInternalState;
}

/** ------------------------------------------------------------------------
 * * Resets and reinitializes a program's internal Commander state.
 * ------------------------------------------------------------------------
 *
 * Discards any existing internal metadata attached to the provided
 * program instance and replaces it with a newly created default state.
 *
 * This ensures a clean lifecycle baseline.
 *
 * ------------------------------------------------------------------------
 * #### Behavior.
 * ------------------------------------------------------------------------
 *
 * - If the program is a {@link CommandBaseProgram | `CommandBaseProgram`},
 *   the state is set via its internal setter.
 *
 * - If the program is a native {@link Command | `Command`},
 *   the state is attached using the internal symbol marker.
 *
 * The previous state (if any) is permanently discarded.
 *
 * ------------------------------------------------------------------------
 *
 * @param cmd - A Commander program instance.
 * @returns The newly created internal state object.
 *
 * @internal
 */
export const resetAllCommandInternal = (
  cmd: CommandContext
): CommanderInternalState => {
  const fresh = createDefaultInternalState();

  // Factory program
  if ("_internalState" in cmd && "_setInternalState" in cmd) {
    cmd._setInternalState(fresh);
    return fresh;
  }

  // Commander / CliCommand
  cmd[COMMANDER_INTERNAL_SYMBOL] = fresh;

  return fresh;
};

/** ------------------------------------------------------------------------
 * * Retrieves the internal Commander state for a program instance.
 * ------------------------------------------------------------------------
 *
 * Returns the internal state associated with the provided program.
 *
 * If no state is currently attached, a new one is created,
 * attached to the program, and returned automatically.
 *
 * This guarantees that a valid internal state object
 * is always returned.
 *
 * ------------------------------------------------------------------------
 * #### 🔄 Lazy Initialization.
 * ------------------------------------------------------------------------
 *
 * This function performs lazy state installation:
 *
 * - If a state exists ➔ it is returned as-is.
 * - If no state exists ➔ a new state is created and attached.
 *
 * This avoids reliance on Commander private internals
 * while ensuring consistent metadata tracking.
 *
 * ------------------------------------------------------------------------
 *
 * @param cmd - A Commander program instance.
 * @returns The resolved {@link CommanderInternalState | `CommanderInternalState`}.
 *
 * @internal
 */
export function getInternalState(cmd: CommandContext): CommanderInternalState {
  // Factory program
  if ("_internalState" in cmd && "_setInternalState" in cmd) {
    let state = cmd._internalState;

    if (!state) {
      state = resetAllCommandInternal(cmd);
      cmd._setInternalState(state);
    }

    return state;
  }

  // Commander / CliCommand
  if (!cmd[COMMANDER_INTERNAL_SYMBOL]) {
    cmd[COMMANDER_INTERNAL_SYMBOL] = resetAllCommandInternal(cmd);
  }

  return cmd[COMMANDER_INTERNAL_SYMBOL];
}

type CreateUIState = OmitStrict<CommanderUiOptions, "__commandName">;

/** ------------------------------------------------------------------------
 * * ***Safely patches internal `ui` state on a Commander instance.***
 * ------------------------------------------------------------------------
 *
 * Applies sanitized UI configuration (via {@link createUIState | `createUIState`})
 * directly into the command's internal state.
 *
 * - *This function:*
 *    - Delegates validation to `createUIState`.
 *    - Preserves existing `ui` properties.
 *    - Lazily initializes `ui` if missing.
 *    - Does NOT overwrite unrelated fields.
 *
 * ------------------------------------------------------------------------
 *
 * @param cmd - Command instance.
 * @param input - Raw UI configuration.
 *
 * @example
 * ```ts
 * setInternalUiState(cmd, { title, usage });
 * ```
 *
 * @internal
 */
export function setInternalUiState(
  cmd: CommandContext,
  input: CreateUIState
): void {
  const internal = getInternalState(cmd);
  const sanitized = createUIState(input);

  if (!internal.ui) {
    internal.ui = sanitized;
    return;
  }

  Object.assign(internal.ui, sanitized);
}

/** ------------------------------------------------------------------------
 * * ***Creates a sanitized `UI` configuration object.***
 * ------------------------------------------------------------------------
 *
 * Builds a partial `UI` state object by conditionally including only
 * valid non-empty string values.
 *
 * - *This helper is intended for internal CLI framework usage where
 * `title` and `usage` must:*
 *    - Be a non-empty string.
 *    - Exclude empty string values.
 *    - Exclude `undefined`.
 *
 * - *Unlike naive object spreading with ternaries, this function ensures:*
 *    - No `undefined` properties are injected.
 *    - No accidental overwrites occur due to falsy values.
 *    - Output object only contains valid keys.
 *
 * ------------------------------------------------------------------------
 *
 * @param input - Partial UI input configuration.
 *
 * @returns A sanitized partial UI object containing only valid properties.
 *
 * @example
 * ```ts
 * const ui = createUIState({ title, usage });
 *
 * internal.ui = {
 *   ...internal.ui,
 *   ...ui
 * };
 * ```
 *
 * @remarks
 * This function performs validation using `isNonEmptyString`, it does
 * not mutate input.
 *
 * @throws Nothing.
 *
 * @internal
 */
export function createUIState(input: CreateUIState): CreateUIState {
  const result: CreateUIState = {};

  if (isNonEmptyString(input.title)) {
    result.title = input.title;
  }

  if (isNonEmptyString(input.usage)) {
    result.usage = input.usage;
  }

  if (isNonEmptyString(input.packageName)) {
    result.packageName = input.packageName;
  }

  if (isNonEmptyString(input.version)) {
    result.version = input.version;
  }

  return result;
}
