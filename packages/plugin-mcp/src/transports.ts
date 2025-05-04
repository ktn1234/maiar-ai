import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { ServerConfig, StdioConfig, StreamableHttpConfig } from "./types";

export function clientCommand(
  command?: string,
  serverScriptPath?: string
): string {
  if (command) return command;

  if (serverScriptPath) {
    const isPython = serverScriptPath.endsWith(".py");
    return isPython
      ? process.platform === "win32"
        ? "python"
        : "python3"
      : process.execPath;
  }

  throw new Error("MCP config needs either {command,args} or serverScriptPath");
}

export function buildTransport(config: StdioConfig): StdioClientTransport;
export function buildTransport(
  config: StreamableHttpConfig
): StreamableHTTPClientTransport;
export function buildTransport(
  config: ServerConfig
): StdioClientTransport | StreamableHTTPClientTransport {
  if ("url" in config) {
    const url = new URL(config.url);
    return new StreamableHTTPClientTransport(url);
  }

  const { serverScriptPath, command, args = [], env } = config as StdioConfig;
  const cmd = clientCommand(command, serverScriptPath);

  // put the script path as first argument
  if (serverScriptPath) args.unshift(serverScriptPath);

  const processEnv = Object.fromEntries(
    Object.entries(process.env).filter(([, v]) => v !== undefined) as [
      string,
      string
    ][]
  );

  return new StdioClientTransport({
    command: cmd,
    args,
    env: {
      ...processEnv,
      ...(env || {})
    }
  });
}
