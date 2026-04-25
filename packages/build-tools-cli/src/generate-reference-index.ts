#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  commandGriIdentity,
  generateReferenceIndex,
  resolvedGriPatternOption,
  type LogLevel
} from "@rzl-zone/build-tools";
import {
  EOL,
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
  outDir?: string;
  outFileName?: string;
  inputDirReference?: string;
  withExportTypes: boolean;
  onlyDeclarations?: boolean;

  banner?: true | ({} & string) | false;
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandGriIdentity
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
          "Generate a TypeScript declaration reference index file (.d.ts)",
          "by aggregating matched output files into a single entry.",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) for declaration or output files.")
  .option(
    "--od, --out-dir <dir>",
    "Output directory for the generated index file",
    "dist/.references"
  )
  .option(
    "--ofn, --out-file-name <name>",
    "Name of the generated declaration index file",
    "index.d.ts"
  )
  .option(
    "--idr, --input-dir-reference <dir>",
    "Base directory used to compute relative reference paths",
    "dist"
  )
  .option(
    "--wet, --with-export-types",
    'Also generate `export * from "..."` statements',
    false
  )
  .option(
    "--nod, --no-only-declarations",
    "Allow non-declaration files (.js, .mjs, .cjs) to be included (declarations only by default)"
  )
  .option(
    "-b, --banner <text>",
    "Prepend custom banner text to the generated output file"
  )
  .option("--nb, --no-banner", "Disable banner injection entirely")
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                                      - silent ➔ no output.",
      "                                      - error ➔ errors only.",
      "                                      - info (default) ➔ standard informational logs (include `error`).",
      "                                      - debug ➔ verbose / debug logs (include `error`).",
      picocolors.italic(
        picocolors.yellowBright(
          "                                     * Invalid values will fallback to the default level"
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
      `  ${picocolors.dim("• The output file is ALWAYS overwritten.")}`,
      `  ${picocolors.dim("• Intended for post-build declaration aggregation.")}`,
      `  ${picocolors.dim("• By default, only TypeScript declaration files are included.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Generate references from declaration files")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"dist/**/*.d.ts"')}`,
      "",
      `  ${picocolors.bold("• Include JavaScript declaration outputs")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim(
        '"dist/**/*.{d.ts,d.js,d.mjs}"'
      )}`,
      "",
      `  ${picocolors.bold("• Generate references and export all types")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"dist/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright("--with-export-types")}`,
      "",
      `  ${picocolors.bold("• Custom output directory and file name")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"build/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright("--out-dir build/types")} \\`,
      `      ${picocolors.cyanBright("--out-file references.d.ts")}`,
      "",
      `  ${picocolors.bold("• Multiple glob patterns")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim(
        '"dist/types/**/*.d.ts"'
      )} ${picocolors.dim('"dist/generated/**/*.d.ts"')}`,
      "",
      `  ${picocolors.bold("• Disable onlyDeclarations to include JS files")}`,
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"dist/**/*"')} \\`,
      `      ${picocolors.cyanBright("--no-only-declarations")}`,
      "",
      picocolors.bold("# Banner Options:"),
      `  ${picocolors.dim("• Default behavior is automatic banner generation.")}`,
      `  ${picocolors.dim("• Use --banner to provide a custom banner string.")}`,
      `  ${picocolors.dim("• Use --no-banner to disable banner injection entirely.")}`,
      "",
      picocolors.bold("• Custom banner example"),
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"dist/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright('--banner "/* My Custom Banner */"')}`,
      "",
      picocolors.bold("• Disable banner"),
      `    ${picocolors.cyan("generate-reference-index")} ${picocolors.dim('"dist/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright("--no-banner")}`
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
    const {
      logLevel,
      onlyDeclarations = true,
      withExportTypes,
      banner: bannerOpt,
      inputDirReference,
      outDir,
      outFileName,
      patternOptions
    } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      {
        globExample: "dist/**/*.d.{cts,ts}",
        patternOptionValue: resolvedGriPatternOption
      }
    );

    const rawArgs = resolveGlobPatterns(program.args, program);
    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    const hasBanner = rawArgs.includes("--banner") || rawArgs.includes("-b");
    const hasNoBanner =
      rawArgs.includes("--no-banner") || rawArgs.includes("--nb");

    let banner: NonNullable<CliOptions["banner"]> = true;

    if (hasBanner && hasNoBanner) {
      program.error("Cannot use --banner and --no-banner together.");
    }

    if (bannerOpt === false) {
      banner = false;
    } else if (typeof bannerOpt === "string" && bannerOpt.trim().length > 0) {
      banner = bannerOpt.replace(/\\n/g, EOL);
    }
    // else if (bannerOpt === true) {
    //   banner = true;
    //   program.error(
    //     joinLinesLoose(
    //       'Invalid value for -b, --banner: "auto".',
    //       "",
    //       'The "auto" banner mode is enabled by DEFAULT.',
    //       "To use automatic banner generation, omit the --banner option.",
    //       "",
    //       "Examples:",
    //       '  generate-reference-index "dist/**/*.d.ts"',
    //       '  generate-reference-index "dist/**/*.d.ts" --no-banner'
    //     )
    //   );
    // }

    try {
      await generateReferenceIndex(rawArgs, {
        outDir,
        outFileName,
        inputDirReference,
        withExportTypes,
        onlyDeclarations,
        banner,
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
