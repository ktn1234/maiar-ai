interface BaseMCPConfig {
  /** Required name passed to the underlying MCP client */
  name: string;
  /** Optional version passed to the underlying MCP client. Defaults to 1.0.0 */
  version?: string;
}

/**
 * The MCP configuration for when a server should be started locally.
 */
export interface StdioConfig extends BaseMCPConfig {
  /** Absolute or relative path to a .js or .py file. Ignored if `command` is provided. */
  serverScriptPath?: string;
  /** If supplied, the executable to run (e.g. "docker", "npx", "node") */
  command?: string;
  /** Arguments passed to the executable. */
  args?: string[];
  /** Extra environment variables for the spawned process. */
  env?: Record<string, string>;
}

/**
 * Streamable HTTP configuration when the server is running remotely or
 * as a separate process.
 * Supports backwards compatibility with SSE servers along with the new standard.
 * See: https://modelcontextprotocol.io/specification/2025-03-26/changelog#major-changes
 */
export interface StreamableHttpConfig extends BaseMCPConfig {
  /** The URL of the server to connect to. */
  url: string;
}

export type ServerConfig = StdioConfig | StreamableHttpConfig;
