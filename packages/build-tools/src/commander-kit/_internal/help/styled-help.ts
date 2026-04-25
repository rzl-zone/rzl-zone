import type { CommandContext } from "@/commander-kit/types";

import { isNonEmptyString } from "@/_internal/utils/helper";

import {
  EOL,
  formatOptionValue,
  joinLinesLoose,
  picocolors
} from "@/utils/client";

import { CliHelp } from "@/commander-kit/core/help";
import { CliOption } from "@/commander-kit/core/option";

import { getInternalState } from "../state";
import { reorderUsage, styleUsage } from "../helpers/usages";

/** Internal for `.createHelp()`.
 *
 * @returns {CliHelp}
 *
 * @internal
 */
export class StyledHelp extends CliHelp {
  constructor() {
    super();
  }

  /** ----------------------------------------------------------------
   * * Resolves the final usage string for a command.
   * ----------------------------------------------------------------
   *
   * Determines the usage output by applying the following
   * **priority order**:
   *  1. Disabled usage (`disableUsage`).
   *  2. Manually defined `.usage()` override.
   *  3. UI configuration override (`ui.usage`).
   *  4. Commander default usage formatting.
   *
   * If no manual or UI override is provided, the usage string
   * returned by Commander is normalized and styled before being
   * returned.
   *
   * ----------------------------------------------------------------
   * @param cmd - The command instance whose usage should be resolved.
   *
   * @returns The resolved usage string, or an empty string if usage
   * output is disabled.
   */
  commandUsage(cmd: CommandContext): string {
    const { manualUsage, ui, disableUsage } = getInternalState(cmd);

    if (disableUsage) return "";

    // manual .usage()
    if (isNonEmptyString(manualUsage)) return manualUsage;

    // UI override
    if (isNonEmptyString(ui?.usage)) return ui.usage;

    // default Commander behavior
    return styleUsage(
      reorderUsage(super.commandUsage(cmd), {
        errorConfig: {
          field: "`super.commandUsage(cmd)`",
          context: "StyledHelp.commandUsage"
        }
      }),
      {
        fromHelpCommandUsage: true,
        errorConfig: {
          field: "`reorderUsage(super.commandUsage(cmd))`",
          context:
            "StyledHelp.commandUsage (by `reorderUsage(super.commandUsage(cmd))`)"
        }
      }
    );
  }

  /** ----------------------------------------------------------------
   * - ***Custom Help formatter that:***
   *       - Applies usage resolution priority.
   *       - Ensures styled "Usage:" block replaces Commander default.
   *
   * This prevents conflicts between manual `.usage()` overrides
   * and UI-defined usage formatting.
   */
  formatHelp(cmd: CommandContext, helper: CliHelp): string {
    const usage = this.commandUsage(cmd);
    const usageBlock = joinLinesLoose(picocolors.reset("Usage:"), `  ${usage}`);
    const rest = super.formatHelp(cmd, helper);

    if (!usage) {
      return rest.replace(/^Usage:[\s\S]*?\n(?=\S)/, "");
    }

    return rest.replace(/^Usage:[\s\S]*?\n(?=\S)/, usageBlock + EOL + EOL);
  }

  /** ----------------------------------------------------------------
   * * Resolves the final usage string for a command.
   * ----------------------------------------------------------------
   *
   * Determines the usage output by applying the following
   * **priority order**:
   *  1. Disabled usage (`disableUsage`).
   *  2. Manually defined `.usage()` override.
   *  3. UI configuration override (`ui.usage`).
   *  4. Commander default usage formatting.
   *
   * If no manual or UI override is provided, the usage string
   * returned by Commander is normalized and styled before being
   * returned.
   *
   * ----------------------------------------------------------------
   * @param cmd - The command instance whose usage should be resolved.
   *
   * @returns The resolved usage string, or an empty string if usage
   * output is disabled.
   */
  optionDescription(option: CliOption) {
    let desc = option.description || "";

    const hasDefault = option.defaultValue !== undefined;

    if (isNonEmptyString(desc)) {
      desc = desc.trim();

      if (hasDefault) {
        if (desc.endsWith(".")) {
          desc = desc.slice(0, -1) + "";
        } else if (!desc.endsWith(",")) {
          desc += "";
        }

        desc += ` ${picocolors.italic(`(default: ${formatOptionValue(option.defaultValue)})`)}.`;
      } else {
        if (!desc.trim().endsWith(".")) {
          desc += ".";
        }
      }
    }

    return desc;
  }
}
