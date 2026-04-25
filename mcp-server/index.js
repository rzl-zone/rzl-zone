import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

import fs from "fs/promises";

const server = new Server(
  {
    name: "monorepo-ai",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// LIST TOOLS
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "readFile",
        description: "Read file from repo",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string" }
          },
          required: ["path"]
        }
      }
    ]
  };
});

// CALL TOOL
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  if (name === "readFile") {
    try {
      const content = await fs.readFile(args.path, "utf-8");

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
            text: "Error: " + err.message
          }
        ]
      };
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Unknown tool"
      }
    ]
  };
});

// START SERVER
const transport = new StdioServerTransport();
await server.connect(transport);
