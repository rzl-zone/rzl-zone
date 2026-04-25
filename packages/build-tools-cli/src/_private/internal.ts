import "@rzl-zone/node-only";

import {
  formatOptionValue,
  joinInline,
  joinLinesLoose,
  picocolors
} from "@rzl-zone/build-tools/utils";
import {
  defaultPatternOptions,
  type PatternOptions
} from "@rzl-zone/build-tools/utils/server";
import { type LogLevel } from "@rzl-zone/build-tools";
import {
  type CommandContext,
  type CommandIdentity
} from "@rzl-zone/build-tools/commander-kit";

/** @internal */
export function resolveGlobPatterns(
  rawPatterns: unknown,
  program: CommandContext,
  {
    argsName = "<glob...>"
  }: {
    /** @default "<glob...>" */
    argsName?: string;
  } = {}
): string[] {
  const patterns = Array.isArray(rawPatterns) ? rawPatterns : [];

  const normalized = patterns
    .map((p) => String(p).trim())
    .filter((p) => p.length > 0);

  if (normalized.length === 0) {
    program.error(`Error: at least one non-empty ${argsName} is required.`);
  }

  return normalized;
}

/** @internal */
export function resolvePatternOptions(
  raw: string | undefined,
  program: CommandContext,
  cmdIdentity: CommandIdentity,
  {
    globExample,
    patternOptionValue
  }: { globExample?: string; patternOptionValue?: PatternOptions } = {}
): PatternOptions | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();

  // Help keyword
  if (trimmed.toLowerCase() === "help") {
    printPatternOptionsHelp(cmdIdentity, {
      globExample,
      patternOptionValue: patternOptionValue
    });
  }

  const parsed = safeParseJSON<PatternOptions>(trimmed);

  if (!parsed) {
    program.error("Invalid JSON format in --pattern-options");
  }

  return parsed;
}

/** @internal */
export function printPatternOptionsHelp(
  cmdIdentity: CommandIdentity,
  {
    globExample,
    patternOptionValue
  }: {
    globExample?: string;
    patternOptionValue?: PatternOptions;
  } = {}
): never {
  const subTittle = picocolors.bold(
    picocolors.magentaBright("Pattern Options Schema Helper:")
  );

  const description = picocolors.bold(
    picocolors.magentaBright(
      joinLinesLoose(
        `  ${picocolors.bold("• Pattern options must be provided as a JSON string.")}`,
        `  ${picocolors.bold("• Unknown keys are automatically removed (sanitized).")}`,
        `  ${picocolors.bold("• Missing keys fallback to internal defaults.")}`
      )
    )
  );

  const example = joinInline(
    picocolors.cyan(cmdIdentity.commandName),
    picocolors.gray(globExample ?? "dist/**/*.{js,cjs}"),
    picocolors.blueBright(
      // eslint-disable-next-line quotes
      '--pattern-options \'{"dot":true,"onlyFiles":true}\''
    )
  );

  const patternOptionDocs: Record<
    string,
    { type: string; description: string }
  > = {
    absolute: {
      type: "boolean",
      description: "Return absolute paths."
    },
    baseNameMatch: {
      type: "boolean",
      description: "Match basename when pattern has no slash."
    },
    braceExpansion: {
      type: "boolean",
      description: "Enable brace expansion."
    },
    caseSensitiveMatch: {
      type: "boolean",
      description: "Enable case-sensitive matching."
    },
    concurrency: {
      type: "number",
      description: "Maximum concurrent directory reads."
    },
    deep: {
      type: "number",
      description: "Maximum recursion depth."
    },
    dot: {
      type: "boolean",
      description: "Match entries starting with period (`.`)."
    },
    extglob: {
      type: "boolean",
      description: "Enable extglob patterns."
    },
    followSymbolicLinks: {
      type: "boolean",
      description: "Traverse symbolic link directories."
    },
    globstar: {
      type: "boolean",
      description: "`**` matches recursively."
    },
    ignore: {
      type: "string[]",
      description: "Glob patterns to exclude."
    },
    markDirectories: {
      type: "boolean",
      description: "Append `/` to directory results."
    },
    objectMode: {
      type: "boolean",
      description: "Return entry objects instead of strings."
    },
    onlyDirectories: {
      type: "boolean",
      description: "Return only directories."
    },
    onlyFiles: {
      type: "boolean",
      description: "Return only files."
    },
    stats: {
      type: "boolean",
      description: "Include fs stats in object mode."
    },
    suppressErrors: {
      type: "boolean",
      description: "Suppress all errors."
    },
    throwErrorOnBrokenSymbolicLink: {
      type: "boolean",
      description: "Throw on broken symbolic link."
    },
    unique: {
      type: "boolean",
      description: "Ensure unique results."
    }
  };

  const safePatternOptionValue =
    typeof patternOptionValue === "object" &&
    patternOptionValue !== null &&
    !Array.isArray(patternOptionValue)
      ? patternOptionValue
      : defaultPatternOptions;

  function renderPatternOptionsDoc(): string {
    const entries = Object.entries(safePatternOptionValue).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    const maxKeyLength = Math.max(...entries.map(([key]) => key.length));

    return entries
      .map(([key, defaultValue]) => {
        const meta = patternOptionDocs[key];

        const paddedKey = key.padEnd(maxKeyLength);

        const header = `   ${picocolors.gray("-")} ${picocolors.blueBright(paddedKey)} ${picocolors.gray(
          `<${meta?.type ?? "unknown"}>`
        )}`;

        const description = picocolors.dim(`       ${meta?.description ?? ""}`);

        const defaultLine = picocolors.yellow(
          `       default: ${formatOptionValue(defaultValue)}`
        );

        return joinLinesLoose(header, description, defaultLine);
      })
      .join("\n");
  }

  console.log(
    joinLinesLoose(
      cmdIdentity.cli(),
      "",
      subTittle,
      description,
      "",
      picocolors.bold(picocolors.whiteBright(" * Example Usage:")),
      `   ${example}`,
      "",
      picocolors.bold(picocolors.whiteBright(" * Supported Pattern Options:")),
      renderPatternOptionsDoc()
    )
  );

  process.exit(0);
}

/** @internal */
export function resolveLogLevelOption(
  raw: unknown,
  program: CommandContext
): LogLevel {
  if (typeof raw === "boolean") {
    program.error(
      "missing required value for option: --ll, --log-level <level>"
    );
  }

  return raw as LogLevel;
}
// ----

/** @internal */
export function safeParseJSON<T = unknown>(input?: string): T | undefined {
  if (!input) return undefined;

  try {
    return JSON.parse(input) as T;
  } catch {
    return undefined;
  }
}
