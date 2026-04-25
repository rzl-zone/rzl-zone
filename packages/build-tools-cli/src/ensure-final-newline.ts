#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  commandEfnIdentity,
  ensureFinalNewline,
  resolvedEfnPatternOption,
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
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandEfnIdentity
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
          "Ensure that files end with exactly ONE Final newline.",
          "",
          "Trailing empty lines are removed and a single newline",
          "is appended when missing.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to target files.")
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
      `  ${picocolors.dim("• Ensures exactly ONE Final Newline (LF / CRLF safe).")}`,
      `  ${picocolors.dim("• Intended for post-build output normalization.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Ensure Final Newline for JS files")}`,
      `    ${picocolors.cyan("ensure-final-newline")} ${picocolors.dim('"dist/**/*.js"')}`,
      "",
      `  ${picocolors.bold("• Multiple extensions")}`,
      `    ${picocolors.cyan("ensure-final-newline")} ${picocolors.dim('"dist/**/*.{js,cjs,mjs,d.ts}"')}`,
      "",
      `  ${picocolors.bold("• Multiple glob patterns")}`,
      `    ${picocolors.cyan("ensure-final-newline")} ${picocolors.dim('"dist/**/*.js" "dist/**/*.d.ts"')}`
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
      { patternOptionValue: resolvedEfnPatternOption }
    );

    const patterns = resolveGlobPatterns(program.args, program);
    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    try {
      await ensureFinalNewline(patterns, {
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
