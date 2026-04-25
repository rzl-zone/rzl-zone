// #!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  stripJsComments,
  commandSjcIdentity,
  resolvedSjcPatternOption,
  type LogLevel
} from "@rzl-zone/build-tools";

import {
  joinInline,
  joinLinesLoose,
  picocolors
} from "@rzl-zone/build-tools/utils";

import { createBaseProgram } from "@rzl-zone/build-tools/commander-kit";

import { PACKAGE_META } from "./_private/constants";
import {
  resolveGlobPatterns,
  resolveLogLevelOption,
  resolvePatternOptions
} from "./_private/internal";

type EcmaVer =
  | "latest"
  | 3
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 2015
  | 2016
  | 2017
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026;
type CliOptions = {
  removeSourceMap?: boolean;
  removeRegion?: boolean;
  ecmaVersion?: EcmaVer;
  sourceType?: "module" | "script" | "commonjs" | undefined;
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandSjcIdentity
  .setPackageName(PACKAGE_META.name)
  .setVersion(PACKAGE_META.version);

/** @preserve @removeDocRuntime  tes */
const program = createBaseProgram({
  commandIdentity: cmdIdentity,
  ui: {
    title: cmdIdentity.cli(),
    usage: joinInline(
      picocolors.cyan(cmdIdentity.commandName),
      picocolors.gray("<glob...>"),
      picocolors.blueBright("[options]")
    )
  }
});

program
  .description(
    picocolors.bold(
      picocolors.magentaBright(
        joinLinesLoose(
          "Strip non-essential comments from compiled JavaScript files.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to JS output files.")
  .option(
    "--rsm, --remove-source-map",
    "Remove sourceMappingURL comments",
    false
  )
  .option("--nrr, --no-remove-region", "Disable removal of region comments")
  .option(
    "--st, --source-type <type>",
    joinLinesLoose(
      "Specify parsing mode:",
      "                                   - module",
      "                                   - script",
      "                                   - commonjs",
      picocolors.italic(
        picocolors.yellowBright(
          "                                  * Invalid values will fallback to default"
        )
      )
    )
  )
  .option(
    "--ecv, --ecma-version <version>",
    joinLinesLoose(
      "Specify ECMAScript version:",
      `                                   - ${picocolors.redBright(5)}, ${picocolors.redBright(2015)}, ${picocolors.redBright(2020)}, etc.`,
      `                                   - ${picocolors.gray('"latest"')} (default).`,
      picocolors.italic(
        picocolors.yellowBright(
          "                                  * Invalid values will fallback to default"
        )
      )
    ),
    "latest"
  )
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                                   - silent ➔ no output.",
      "                                   - error ➔ errors only.",
      "                                   - info (default) ➔ standard informational logs (include `error`).",
      "                                   - debug ➔ verbose / debug logs (include `error`).",
      picocolors.italic(
        picocolors.yellowBright(
          "                                  * Invalid values will fallback to the default level"
        )
      )
    ),
    "info"
  )
  .option(
    "--po, --pattern-options <json>",
    "Pattern matching options in JSON format"
  )
  .addHelpText(
    "after",
    joinLinesLoose(
      "",
      picocolors.bold("# Notes:"),
      `  ${picocolors.dim("• Multiple glob patterns are supported.")}`,
      `  ${picocolors.dim("• Files are modified IN PLACE.")}`,
      `  ${picocolors.dim("• Only JavaScript output files are processed.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Strip comments")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')}`,
      "",
      `  ${picocolors.bold("• Remove source maps & regions")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--remove-source-map")}`,
      "",
      `  ${picocolors.bold("• Use script parsing mode")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--source-type script")}`,
      "",
      `  ${picocolors.bold("• Debug logging")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--log-level debug")}`
    )
  )
  .addHelpText(
    "after",
    joinLinesLoose(
      "",
      picocolors.bold("# Pattern Options:"),
      `  ${picocolors.dim("• Must be provided as a JSON string.")}`,
      `  ${picocolors.dim("• Unknown keys are automatically removed (sanitized).")}`,
      `  ${picocolors.dim("• Missing keys fallback to internal defaults.")}`,
      `  ${picocolors.dim("• Use '--pattern-options help' to view full schema.")}`,
      "",
      `  ${picocolors.bold("Examples:")}`,
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.gray('"dist/**/*.{js,cjs}"')} \\`,
      `       ${picocolors.blueBright("--pattern-options")} ${picocolors.dim(picocolors.gray('\'{"dot":true,"absolute":true}\''))}`,
      "",
      `  ${picocolors.bold("Schema Help:")}`,
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.blueBright("--pattern-options")} ${picocolors.gray("help")}`,
      "",
      `  ${picocolors.dim("Pattern options are a restricted subset configuration.")}`
    )
  )
  .action(async () => {
    const {
      logLevel,
      removeSourceMap,
      removeRegion,
      sourceType,
      ecmaVersion,
      patternOptions
    } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      { patternOptionValue: resolvedSjcPatternOption }
    );

    const patterns = resolveGlobPatterns(program.args, program);
    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    function resolveEcmaVersion(value?: EcmaVer): EcmaVer | undefined {
      if (!value) return undefined;

      if (value === "latest") return "latest";

      const num = Number(value);
      return Number.isNaN(num) ? undefined : (num as EcmaVer);
    }

    try {
      await stripJsComments(patterns, {
        removeSourceMap,
        removeRegion,
        ecmaVersion: resolveEcmaVersion(ecmaVersion),
        sourceType: sourceType,
        logLevel: resolvedLogLevel,
        patternOptions: parsedPatternOptions,
        __commandTitle: cmdIdentity.cli()
      });
    } catch (err) {
      console.error(picocolors.redBright(String(err)));
      process.exit(1);
    }
  });

program.parseAsync();
