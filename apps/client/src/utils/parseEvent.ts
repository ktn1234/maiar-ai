import { MonitorEvent } from "../types/monitorSpec";

export function parseRaw(raw: unknown): MonitorEvent {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid monitor event");
  }
  const evt = raw as MonitorEvent & Record<string, unknown>;
  // normalise timestamp → number
  if (typeof evt.timestamp !== "number") {
    evt.timestamp = new Date(evt.timestamp as unknown as string).getTime();
  }
  if (!evt.message) {
    evt.message = "";
  }

  // If metadata missing, derive it from remaining keys (excluding canonical fields)
  if (!("metadata" in evt) || evt.metadata === undefined) {
    const { ...rest } = evt;
    // only set if rest has keys
    if (Object.keys(rest).length) {
      evt.metadata = rest as Record<string, unknown>;
    }
  }

  return evt as MonitorEvent;
}
