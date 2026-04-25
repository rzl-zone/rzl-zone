#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  cleanJsBuildArtifacts,
  commandCjbaIdentity,
  resolvedCleanPatternOption,
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

type CliOptions = {
  removeEmptyLines?: boolean;
  removeSourceMap?: boolean;
  removeRegion?: boolean;
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandCjbaIdentity
  .setPackageName(PACKAGE_META.name)
  .setVersion(PACKAGE_META.version);

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
          "Remove JavaScript build artifacts such as injected comments",
          "from compiled output files.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to JS output files.")
  .option(
    "--rel, --remove-empty-lines",
    "Remove blank lines adjacent to removed comments",
    false
  )
  .option(
    "--rsm, --remove-source-map",
    "Remove sourceMappingURL comments",
    false
  )
  .option("--nrr, --no-remove-region", "Disable remove region comments")
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                                  - silent ➔ no output.",
      "                                  - error ➔ errors only.",
      "                                  - info (default) ➔ standard informational logs (include `error`).",
      "                                  - debug ➔ verbose / debug logs (include `error`).",
      picocolors.yellowBright(
        "                                 * Invalid values will fallback to the default level"
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
      `  ${picocolors.dim("• You may provide MULTIPLE glob patterns.")}`,
      `  ${picocolors.dim("• All positional arguments are treated as glob patterns.")}`,
      `  ${picocolors.dim("• Files are modified IN PLACE.")}`,
      `  ${picocolors.dim("• Intended for cleaning compiled JavaScript output.")}`,
      `  ${picocolors.dim("• Invalid --log-level values will fallback to the default level.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Remove JS build artifacts")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')}`,
      "",
      `  ${picocolors.bold("• Multiple extensions")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.{js,cjs,mjs}"')}`,
      "",
      `  ${picocolors.bold("• Disable source map removal & clean empty lines")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--remove-source-map")} \\`,
      `      ${picocolors.cyanBright("--remove-empty-lines")}`,
      "",
      `  ${picocolors.bold("• Enable verbose debug logging")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--log-level debug")}`,
      "",
      `  ${picocolors.bold("• Silent mode (no logs at all)")}`,
      `    ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--log-level silent")}`
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
      removeEmptyLines,
      removeSourceMap,
      patternOptions,
      removeRegion
    } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      { patternOptionValue: resolvedCleanPatternOption }
    );

    const patterns = resolveGlobPatterns(program.args, program);
    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    try {
      await cleanJsBuildArtifacts(patterns, {
        removeSourceMap,
        removeRegion,
        removeAdjacentEmptyLines: removeEmptyLines,
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
