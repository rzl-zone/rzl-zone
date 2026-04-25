#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  commandIdIdentity,
  injectDirective,
  resolvedIdPatternOption,
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
  directive?: string[];
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandIdIdentity
  .setPackageName(PACKAGE_META.name)
  .setVersion(PACKAGE_META.version);

const program = createBaseProgram({
  commandIdentity: cmdIdentity,
  ui: {
    title: cmdIdentity.cli(),
    usage: joinInline(
      picocolors.cyan(cmdIdentity.commandName),
      joinInline(
        picocolors.gray("<glob...>"),
        picocolors.reset("--directive"),
        picocolors.gray('"use client"'),
        picocolors.blueBright("[options]")
      )
    )
  }
});

program
  .description(
    picocolors.bold(
      picocolors.magentaBright(
        joinLinesLoose(
          "Inject directive statements into compiled JavaScript output files.",
          "",
          "Directives are injected at the top of each file when applicable,",
          "while avoiding duplication and preserving existing content.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to JS output files.")
  .option(
    "-d, --directive <directive...>",
    'Directive(s) to inject (e.g. "use strict", "use client")'
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
          `                                 * Invalid values will fallback to the default level`
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
      `  ${picocolors.dim("• Directives are injected ONLY when missing.")}`,
      `  ${picocolors.dim("• Files are modified IN PLACE.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Inject use strict")}`,
      `    ${picocolors.cyan("inject-directive")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--directive")} ${picocolors.dim('"use strict"')}`,
      "",
      `  ${picocolors.bold("• Inject multiple directives")}`,
      `    ${picocolors.cyan("inject-directive")} ${picocolors.dim('"dist/**/*.{js,mjs}"')} \\`,
      `      ${picocolors.cyanBright("--directive")} ${picocolors.dim('"use strict"')} ${picocolors.dim('"use client"')}`,
      "",
      `  ${picocolors.bold("• Multiple glob patterns")}`,
      `    ${picocolors.cyan("inject-directive")} \\`,
      `      ${picocolors.dim('"dist/**/*.js"')} ${picocolors.dim('"build/**/*.mjs"')} \\`,
      `      ${picocolors.cyanBright("--directive")} ${picocolors.dim('"use strict"')}`
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
    const { logLevel, directive, patternOptions } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      { patternOptionValue: resolvedIdPatternOption }
    );

    const patterns = resolveGlobPatterns(program.args, program);

    if (!directive || directive.length === 0) {
      return program.error(
        "Error: at least one -d, --directive must be provided."
      );
    }

    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    try {
      await injectDirective(patterns, directive, {
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
