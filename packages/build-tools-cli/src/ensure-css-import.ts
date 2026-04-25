#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";
import {
  commandEciIdentity,
  ensureCssImport,
  resolvedEciPatternOption,
  type LogLevel
} from "@rzl-zone/build-tools";
import {
  joinInline,
  joinLinesLoose,
  picocolors
} from "@rzl-zone/build-tools/utils";
import { createBaseProgram } from "@rzl-zone/build-tools/commander-kit";

import {
  resolveGlobPatterns,
  resolveLogLevelOption,
  resolvePatternOptions
} from "./_private/internal";
import { PACKAGE_META } from "./_private/constants";

type CliOptions = {
  css?: string[];
  dedupe?: boolean;
  sort?: boolean;
  minify?: boolean;
  /** @deprecated  */
  insertTop?: boolean;
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandEciIdentity
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
          "Ensure CSS import statements exist in compiled JavaScript files.",
          "CSS imports will be inserted after directive prologue by default.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to JS output files.")
  .option(
    "-c, --css <path...>",
    "CSS import path(s) to ensure (can be used multiple times)"
  )
  .option(
    "--nd, --no-dedupe",
    "Disable duplicate CSS import removal (enabled by default)"
  )
  .option(
    "-m, --minify",
    "Minify JS output (except directive prologue).",
    false
  )
  .option(
    "-s, --sort",
    "Sort CSS imports alphabetically before inserting",
    false
  )
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
          "                                 * Invalid values will fallback to the default level"
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
      `  ${picocolors.dim("• You may provide MULTIPLE glob patterns.")}`,
      `  ${picocolors.dim("• All positional arguments are treated as glob patterns.")}`,
      `  ${picocolors.dim("• Files are modified IN PLACE.")}`,
      `  ${picocolors.dim("• CSS imports are inserted AFTER directives by default.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Ensure a single CSS import")}`,
      `    ${picocolors.cyan("ensure-css-import")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--css")} ${picocolors.dim("./search.css")}`,
      "",
      `  ${picocolors.bold("• Multiple CSS imports")}`,
      `    ${picocolors.cyan("ensure-css-import")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--css")} ${picocolors.dim("./search.css")} \\`,
      `      ${picocolors.cyanBright("--css")} ${picocolors.dim("./theme.css")}`,
      "",
      `  ${picocolors.bold("• Sort CSS imports alphabetically & disable dedupe & minify")}`,
      `    ${picocolors.cyan("ensure-css-import")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--css")} ${picocolors.dim("./style.css")} \\`,
      `      ${picocolors.cyanBright("--minify")} \\`,
      `      ${picocolors.cyanBright("--sort")}`,
      `      ${picocolors.cyanBright("--no-dedupe")}`
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
    try {
      const { logLevel, css, minify, dedupe, sort, patternOptions } =
        program.opts<CliOptions>();

      const parsedPatternOptions = resolvePatternOptions(
        patternOptions,
        program,
        cmdIdentity,
        { patternOptionValue: resolvedEciPatternOption }
      );

      const patterns = resolveGlobPatterns(program.args, program);

      if (!css || css.length === 0) {
        return program.error("Missing required option: -c, --css <path...>");
      }

      const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

      await ensureCssImport(patterns, {
        sort,
        minify,
        cssImportPath: css || [],
        dedupe,
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
