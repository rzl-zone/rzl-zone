import type { Linter, Rule } from "eslint";
import noReact19ApiRule from "./rules/no-react19-api";

/** -------------------------------------------------------------
 * * ***All rules provided by the `@rzl-zone/eslint` plugin.***
 * -------------------------------------------------------------
 *
 * Keys represent rule names **without** the plugin prefix.
 *
 * @example
 * ```ts
 * rules: {
 *   "@rzl-zone/eslint/no-react19-api": "error"
 * }
 * ```
 */
export const rules = {
  "no-react19-api": noReact19ApiRule
} satisfies Record<string, Rule.RuleModule>;

/** -------------------------------------------------------------
 * * ***Preset rule configurations intended to be consumed via
 * `plugin.configs`.***
 * -------------------------------------------------------------
 *
 * ⚠️ These presets **do NOT register the plugin** and are
 * **NOT flat-config ready** on their own.
 *
 * They exist primarily for:
 * - Backward compatibility
 * - Programmatic composition
 * - Documentation parity with classic ESLint plugins
 */
const presets = {
  /** -------------------------------------------------------------
   * * ***Recommended rule set for `@rzl-zone/eslint`.***
   * -------------------------------------------------------------
   */
  recommended: {
    rules: {
      "@rzl-zone/eslint/no-react19-api": "error"
    } as Linter.RulesRecord
  }
} satisfies Record<string, Linter.Config>;

/** -------------------------------------------------------------
 * * ***The `eslint-rzlzone` ESLint plugin definition.***
 * -------------------------------------------------------------
 *
 * This object registers:
 * - Plugin metadata
 * - Available rules
 * - Rule-only preset configurations
 *
 * @example
 * ```ts
 * plugins: {
 *   "@rzl-zone/eslint": plugin
 * }
 * ```
 */
const plugin = {
  meta: {
    name: "@rzl-zone/eslint"
  },
  rules,
  configs: presets
};

/** -------------------------------------------------------------
 * * ***Flat Config compatible preset for `eslint-rzlzone`.***
 * -------------------------------------------------------------
 *
 * This configuration:
 * - Registers the plugin
 * - Applies the recommended rule set
 * - Can be used directly in `defineConfig`
 *
 * @example
 * ```ts
 * import { defineConfig } from "eslint/config";
 * import { flatConfigs } from "@rzl-zone/eslint";
 *
 * export default defineConfig([
 *   flatConfigs.recommended
 * ]);
 * ```
 */
const flatRecommended = {
  name: "@rzl-zone/eslint/recommended",
  plugins: {
    "@rzl-zone/eslint": plugin
  },
  rules: {
    ...presets.recommended.rules
  }
};

export default plugin;

/** Named export for rule access */
export { plugin as plugins };

/** -------------------------------------------------------------
 * * ***Flat-config-ready presets.***
 * -------------------------------------------------------------
 *
 * These are the **preferred exports** when using ESLint v9+
 * with `defineConfig`.
 */
export const flatConfigs = {
  recommended: flatRecommended as Linter.Config
};
