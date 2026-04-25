#!/usr/bin/env node

import "@rzl-zone/node-only";

import {
  commandCftdIdentity,
  copyFileToDest,
  createCopyFileToDestParameterSet,
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
  resolveLogLevelOption
} from "./_private/internal";
import { PACKAGE_META } from "./_private/constants";

type CliOptions = {
  target?: string;
  outputRoot?: string;
  absolute?: boolean;
  rename?: string;
  logLevel?: LogLevel | boolean;
};

const cmdIdentity = commandCftdIdentity
  .setPackageName(PACKAGE_META.name)
  .setVersion(PACKAGE_META.version);

const program = createBaseProgram({
  commandIdentity: cmdIdentity,
  ui: {
    title: cmdIdentity.cli(),
    usage: joinInline(
      picocolors.cyan(cmdIdentity.commandName),
      picocolors.gray("<source...>"),
      picocolors.reset("--target"),
      picocolors.gray("<dir>"),
      picocolors.blueBright("[options]")
    )
  }
});

program
  .description(
    picocolors.bold(
      picocolors.magentaBright(
        joinLinesLoose(
          "Copy one or more files of ANY type into a destination directory.",
          "",
          "All non-flag arguments are treated as source file paths."
        )
      )
    )
  )
  .argument("[source...]", "Source file path(s) to be copy.")
  .option("-t, --target <dir>", "Target directory where files will be copied.")
  .option(
    "--otr, --output-root <dir>",
    "Output root directory used when resolving the target path",
    "dist"
  )
  .option(
    "-a, --absolute",
    "Treat <target> as an absolute path relative to project root (disables --output-root)",
    false
  )
  .option(
    "-r, --rename <file>",
    "Rename the copied file (only valid when a single source is provided)"
  )
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                              - silent ➔ no output.",
      "                              - error ➔ errors only.",
      "                              - info (default) ➔ standard informational logs (include `error`).",
      "                              - debug ➔ verbose / debug logs (include `error`).",

      picocolors.italic(
        picocolors.yellowBright(
          "                             * Invalid values will fallback to the default level"
        )
      )
    ),
    "info"
  )
  .addHelpText(
    "after",
    joinLinesLoose(
      "",
      picocolors.bold("# Notes:"),
      `  ${picocolors.dim("• You may provide MULTIPLE source files.")}`,
      `  ${picocolors.dim("• All positional arguments are treated as sources.")}`,
      `  ${picocolors.dim("• When multiple sources are provided, original file names are preserved.")}`,
      `  ${picocolors.dim("• --rename is invalid when multiple sources are provided.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Copy a single file")}`,
      `    ${picocolors.cyan("copy-file-to-dest")} src/logo.png ${picocolors.cyanBright(
        "--target"
      )} assets`,
      "",
      `  ${picocolors.bold("• Copy multiple files")}`,
      `    ${picocolors.cyan("copy-file-to-dest")} src/a.json src/b.json ${picocolors.cyanBright(
        "--target"
      )} config`,
      "",
      `  ${picocolors.bold("• Copy and rename a single file")}`,
      `    ${picocolors.cyan("copy-file-to-dest")} src/app.json ${picocolors.cyanBright(
        "--target"
      )} config ${picocolors.cyanBright("--rename")} app.config.json`,
      "",
      `  ${picocolors.bold("• Copy using an absolute target path")}`,
      `    ${picocolors.cyan("copy-file-to-dest")} src/config.json ${picocolors.cyanBright(
        "--target"
      )} config/runtime ${picocolors.cyanBright("--absolute")}`
    )
  )
  .action(async () => {
    const { absolute, logLevel, outputRoot, rename, target } =
      program.opts<CliOptions>();

    const sources = resolveGlobPatterns(program.args, program, {
      argsName: "<source...>"
    });

    if (!target) {
      return program.error("missing required option: -t, --target <dir>");
    }

    const srcLen = sources.length;

    if (rename && srcLen > 1) {
      return program.error(
        `argument ('-r' or '--rename') can only be used with a single source file, but received ${srcLen} source file(s).`
      );
    }

    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    const payload = createCopyFileToDestParameterSet(
      srcLen === 1
        ? {
            source: sources![0] || "",
            target,
            fileName: rename,
            outputRoot: absolute ? undefined : outputRoot,
            absoluteTarget: absolute
          }
        : sources.map((source) => ({
            source,
            target,
            outputRoot: absolute ? undefined : outputRoot,
            absoluteTarget: absolute
          }))
    );

    try {
      await copyFileToDest(payload, {
        logLevel: resolvedLogLevel,
        __commandTitle: cmdIdentity.cli()
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parseAsync();
