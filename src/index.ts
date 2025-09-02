#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import scaleDeployment from "./tools/scaleDeployment.js";
import getLogs from "./tools/getLogs.js";
import listResources from "./tools/listResources.js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function wrap(result: unknown) {
  const text = typeof result === "string" ? result : JSON.stringify(result as JsonValue, null, 2);
  return { content: [{ type: "text" as const, text }] };
}

const server = new McpServer({
  name: "mcp-k8s-server",
  version: "1.0.0"
});

server.registerTool(
  "scale-deployment",
  {
    title: "Scale Deployment",
    description: scaleDeployment.description,
    inputSchema: scaleDeployment.inputSchema.shape
  },
  async (args: unknown) => {
    const { namespace, name, replicas } = (args ?? {}) as any;
    const res = await scaleDeployment.handler({ namespace, name, replicas });
    return wrap(res);
  }
);

server.registerTool(
  "get-logs",
  {
    title: "Get Pod Logs",
    description: getLogs.description,
    inputSchema: getLogs.inputSchema.shape
  },
  async (args: unknown) => {
    const { namespace, podName, container } = (args ?? {}) as any;
    const res = await getLogs.handler({ namespace, podName, container });
    return wrap(res);
  }
);

server.registerTool(
  "list-resources",
  {
    title: "List Resources",
    description: listResources.description,
    inputSchema: listResources.inputSchema.shape
  },
  async (args: unknown) => {
    const { namespace } = (args ?? {}) as any;
    const res = await listResources.handler({ namespace });
    return wrap(res);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stdin.resume();
