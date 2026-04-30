// @ts-check

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import { z } from "zod";

const server = new McpServer({
  name: "monorepo-ai",
  version: "1.0.0"
});

const readFileSchema = z.object({
  path: z.string()
});

// TOOL
server.registerTool(
  "readFile",
  {
    description: "Read file from repo",
    inputSchema: readFileSchema
  },
  async (args) => {
    const { path } = args;

    try {
      const content = await fs.readFile(path, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: content
          }
        ]
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: "Error: " + (err instanceof Error ? err.message : String(err))
          }
        ],
        isError: true
      };
    }
  }
);

/** @param {...unknown} args */
const log = (...args) => console.error("[MCP]", ...args);

/** @param {...unknown} args */
const logError = (...args) => console.error("[MCP ERROR]", ...args);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log("server running");
  } catch (error) {
    logError("failed:", error);
  }
}

main();
