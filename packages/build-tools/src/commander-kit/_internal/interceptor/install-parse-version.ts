import type { CommandContext } from "@/commander-kit/types";

import {
  ensureVersionInjected,
  type EnsureVersionInjectedOptions
} from "@/commander-kit/_internal/helpers/versions";

/** ------------------------------------------------------------------------
 * * Installs a version injection interceptor on a Commander program.
 * ------------------------------------------------------------------------
 *
 * Wraps the program's `Command` instance `.parse()` and `.parseAsync()` methods to ensure
 * that version metadata is injected immediately before execution begins.
 *
 * This enables lazy version wiring, meaning version configuration
 * is applied at parse-time rather than during initial setup.
 *
 * ------------------------------------------------------------------------
 * #### Behavior.
 * ------------------------------------------------------------------------
 *
 * - Preserves the original `Command` instance `.parse()` and `.parseAsync()` method bindings.
 * - Invokes {@link ensureVersionInjected | `ensureVersionInjected()`} before delegating to the original method.
 * - Does not alter Commander’s execution semantics.
 * - Transparently returns the original method results.
 *
 * ------------------------------------------------------------------------
 * #### ⚠️ Important Notes.
 * ------------------------------------------------------------------------
 *
 * - This function mutates the provided `program` instance.
 * - It should only be installed once per program instance.
 * - Intended strictly for internal UI-layer lifecycle orchestration.
 *
 * ------------------------------------------------------------------------
 *
 * @param program - A Commander program instance, this may be either:
 * - A program created via `createBaseProgram()`, or
 * - A native `Command` instance created directly from Commander.
 *
 * @param options - Configuration object controlling version injection.
 * @param options.versionInjection - Options forwarded to
 * `ensureVersionInjected()` prior to parsing.
 *
 * @internal
 */
export function installParseVersionInterceptor(
  program: CommandContext,
  options: { versionInjection: EnsureVersionInjectedOptions }
): void {
  const { versionInjection } = options;

  const originalParse = program.parse.bind(program);
  const originalParseAsync = program.parseAsync.bind(program);

  program.parse = function (...args) {
    ensureVersionInjected(program, versionInjection);
    return originalParse(...args);
  };

  program.parseAsync = async function (...args) {
    ensureVersionInjected(program, versionInjection);
    return originalParseAsync(...args);
  };
}
