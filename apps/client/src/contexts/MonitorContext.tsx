import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer
} from "react";

import { DEFAULT_URLS, STORAGE_KEYS } from "../config";
import { monitorReducer, MonitorState } from "../state/monitorReducer";
import { parseRaw } from "../utils/parseEvent";

// ----------------------
// Context + Provider
// ----------------------
type ExtendedMonitorState = MonitorState & {
  url: string;
  setUrl: (url: string) => void;
};

export const MonitorContext = createContext<ExtendedMonitorState | undefined>(
  undefined
);

export function MonitorProvider({ children }: { children: ReactNode }) {
  // Initial state
  const [state, dispatch] = useReducer(monitorReducer, {
    connected: false,
    events: []
  });

  // WebSocket URL (persisted)
  const urlRef = React.useRef<string>(
    localStorage.getItem(STORAGE_KEYS.MONITOR_WEBSOCKET_URL) ??
      DEFAULT_URLS.MONITOR_WEBSOCKET
  );

  const reconnectTimeout = React.useRef<number | undefined>(undefined);
  const wsRef = React.useRef<WebSocket | null>(null);

  const [, forceRerender] = React.useReducer((x) => x + 1, 0);

  // ----------------------
  // helpers
  // ----------------------
  const openSocket = React.useCallback(() => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(urlRef.current);
    wsRef.current = ws;

    ws.onopen = () => dispatch({ type: "WS_CONNECTED" });
    ws.onclose = () => {
      dispatch({ type: "WS_DISCONNECTED" });
      // basic reconnect every 3s
      reconnectTimeout.current = window.setTimeout(() => openSocket(), 3000);
    };
    ws.onerror = () => {
      /* ignore */
    };
    ws.onmessage = (e) => {
      try {
        const ev = parseRaw(JSON.parse(e.data));
        dispatch({ type: "LOG_EVENT", payload: ev });
      } catch (err) {
        console.error("Failed to parse monitor event", err);
      }
    };
  }, []);

  useEffect(() => {
    openSocket();
    return () => {
      if (reconnectTimeout.current)
        window.clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [openSocket]);

  const setUrl = (newUrl: string) => {
    localStorage.setItem(STORAGE_KEYS.MONITOR_WEBSOCKET_URL, newUrl);
    urlRef.current = newUrl;
    forceRerender();
    openSocket();
  };

  return (
    <MonitorContext.Provider value={{ ...state, url: urlRef.current, setUrl }}>
      {children}
    </MonitorContext.Provider>
  );
}

// ----------------------
// Selector hooks
// ----------------------
export const useMonitorState = () => {
  const ctx = useContext(MonitorContext);
  if (!ctx)
    throw new Error("useMonitor hooks must be used within MonitorProvider");
  return ctx;
};

export const useAgentState = () => useMonitorState().agentState;
export const usePipelineState = () => useMonitorState().pipelineState;
export const useEvents = () => useMonitorState().events;
export const useWsConnected = () => useMonitorState().connected;
