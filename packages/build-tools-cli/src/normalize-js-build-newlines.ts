#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  commandNjbnIdentity,
  normalizeJsBuildNewlines,
  resolvedNjbnPatternOption,
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
  resolvePatternOptions
} from "./_private/internal";

type CliOptions = {
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandNjbnIdentity
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
          "Normalize excessive blank lines in compiled JavaScript files.",
          "Any occurrence of three or more consecutive newlines will be",
          "collapsed into exactly two newlines.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to JS input files.")
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                                  - silent ➔ no output.",
      "                                  - error ➔ errors only.",
      "                                  - info (default) ➔ standard informational logs (include `error`).",
      "                                  - debug ➔ verbose / debug logs (include `error`).",
      picocolors.italic(
        picocolors.yellowBright(
          `                                 * Invalid values will fallback to the default level`
        )
      ),
      ""
    )
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
      `  ${picocolors.dim("• Only .js, .cjs, and .mjs files are processed.")}`,
      `  ${picocolors.dim("• Safe to run multiple times (idempotent).")}`,
      `  ${picocolors.dim("• Intended for post-build cleanup.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Normalize newlines in all JS files")}`,
      `    ${picocolors.cyan("normalize-js-build-newlines")} ${picocolors.dim('"dist/**/*.js"')}`,
      "",
      `  ${picocolors.bold("• Normalize multiple JS output extensions")}`,
      `    ${picocolors.cyan("normalize-js-build-newlines")} ${picocolors.dim(
        '"dist/**/*.{js,cjs,mjs}"'
      )}`,
      "",
      `  ${picocolors.bold("• Multiple glob patterns")}`,
      `    ${picocolors.cyan("normalize-js-build-newlines")} ${picocolors.dim(
        '"dist/**/*.js"'
      )} ${picocolors.dim('"build/**/*.mjs"')} ${picocolors.dim('"out/**/*.{js,mjs}"')}`
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
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.gray('"dist/**/*.js"')} \\`,
      `       ${picocolors.blueBright("--pattern-options")} ${picocolors.dim(picocolors.gray('\'{"dot":true,"onlyFiles":true}\''))}`,
      "",
      `  ${picocolors.bold("Schema Help:")}`,
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.blueBright("--pattern-options")} ${picocolors.gray("help")}`,
      "",
      `  ${picocolors.dim("Pattern options are a restricted subset configuration.")}`
    )
  )
  .action(async () => {
    const { logLevel, patternOptions } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      { patternOptionValue: resolvedNjbnPatternOption }
    );

    const patterns = resolveGlobPatterns(program.args, program);

    if (typeof logLevel === "boolean") {
      return program.error(
        "missing required value option: --ll, --log-level <level>"
      );
    }

    try {
      await normalizeJsBuildNewlines(patterns, {
        logLevel,
        patternOptions: parsedPatternOptions,
        __commandTitle: cmdIdentity.cli()
      });
    } catch (err) {
      console.error(picocolors.redBright(String(err)));
      process.exit(1);
    }
  });

program.parseAsync();
