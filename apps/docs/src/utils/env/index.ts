import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

import { isNil } from "@rzl-zone/utils-js/predicates";
import { removeSpaces } from "@rzl-zone/utils-js/strings";

const normalizeEnvVarURL = (variable: string | undefined | null) => {
  if (isNil(variable)) return undefined;
  return removeSpaces(variable).replace(/\/+$/, "");
};

export const env = createEnv({
  server: {
    // ORAMA
    ORAMA_SECRET_API_KEY: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),

    // ALGOLIA
    ALGOLIA_SECRET_API_KEY: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      })
  },
  client: {
    // MAIN BASE APP
    NEXT_PUBLIC_APP_NAME: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_APP_RELEASE: z
      .string({
        error:
          "Is required with valid type year `number`, with format (`YYYY`)."
      })
      .regex(
        /^\d{4}$/,
        "Must be a 4-digit year with format (`YYYY`), e.g: (`2020` / `2023` / `2025`)."
      )
      .transform(Number)
      .pipe(
        z
          .number()
          .min(2000, {
            error: (issue) => {
              return `Year must be a valid year (>= \`2000\`), but received: \`${issue.input}\`.`;
            }
          })
          .max(2100, {
            error: (issue) => {
              return `Year must be a valid year (<= \`2100\`), but received: \`${issue.input}\`.`;
            }
          })
      ),
    NEXT_PUBLIC_APP_POWERED_BY: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),

    NEXT_PUBLIC_BASE_URL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_BASE_URL_LOCAL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_BACKEND_API_URL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_BACKEND_API_URL_LOCAL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),

    NEXT_PUBLIC_GITHUB_ORG_URL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_GITHUB_REPO_URL: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),

    // ORAMA
    NEXT_PUBLIC_ORAMA_API_KEY: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_ORAMA_ENDPOINT: z
      .url({
        error: "Is required value with valid type `URL` format."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),

    // ALGOLIA
    NEXT_PUBLIC_ALGOLIA_APP_ID: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      }),
    NEXT_PUBLIC_ALGOLIA_API_KEY: z
      .string({
        error: "Is required value with valid type `string`."
      })
      .nonempty({
        error: "Value cannot be empty-string."
      })
  },
  experimental__runtimeEnv: {
    // MAIN BASE APP
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_RELEASE: process.env.NEXT_PUBLIC_APP_RELEASE,
    NEXT_PUBLIC_APP_POWERED_BY: process.env.NEXT_PUBLIC_APP_POWERED_BY,

    NEXT_PUBLIC_BASE_URL: normalizeEnvVarURL(process.env.NEXT_PUBLIC_BASE_URL),
    NEXT_PUBLIC_BASE_URL_LOCAL: normalizeEnvVarURL(
      process.env.NEXT_PUBLIC_BASE_URL_LOCAL
    ),
    NEXT_PUBLIC_BACKEND_API_URL: normalizeEnvVarURL(
      process.env.NEXT_PUBLIC_BACKEND_API_URL
    ),
    NEXT_PUBLIC_BACKEND_API_URL_LOCAL: normalizeEnvVarURL(
      process.env.NEXT_PUBLIC_BACKEND_API_URL_LOCAL
    ),
    NEXT_PUBLIC_GITHUB_ORG_URL: normalizeEnvVarURL(
      process.env.NEXT_PUBLIC_GITHUB_ORG_URL
    ),
    NEXT_PUBLIC_GITHUB_REPO_URL: normalizeEnvVarURL(
      process.env.NEXT_PUBLIC_GITHUB_REPO_URL
    ),

    // ORAMA
    // ORAMA_SECRET_API_KEY: process.env.ORAMA_SECRET_API_KEY,
    NEXT_PUBLIC_ORAMA_API_KEY: process.env.NEXT_PUBLIC_ORAMA_API_KEY,
    NEXT_PUBLIC_ORAMA_ENDPOINT: process.env.NEXT_PUBLIC_ORAMA_ENDPOINT,

    // ALGOLIA
    // ALGOLIA_SECRET_API_KEY: process.env.ALGOLIA_SECRET_API_KEY,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
  },
  onValidationError(issues) {
    // Group by variable name (path)
    const grouped = issues.reduce(
      (acc, issue) => {
        const path = issue.path?.join(".") || "UNKNOWN_ENV";
        if (!acc[path]) acc[path] = [];
        acc[path].push(issue.message);
        return acc;
      },
      {} as Record<string, string[]>
    );

    // Format output
    const formatted = Object.entries(grouped)
      .map(([path, messages]) => {
        const details = messages.map((msg) => `    - ${msg}`).join("\n");
        return `  • ${path}:\n${details}`;
      })
      .join("\n\n");

    throw new Error(
      [
        "❌ Environment Variable Validation Failed.",
        "",
        "The following environment variables are missing or invalid:",
        formatted,
        "",
        "💡 Tip: Check your .env or .env.local file and ensure all required variables are set."
      ].join("\n")
    );
  }
});
