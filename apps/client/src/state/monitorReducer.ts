import {
  AgentStatePayload,
  MonitorEvent,
  PipelineGenerationComplete,
  PipelineModificationApplied,
  PipelineStepExecuted,
  StateUpdate
} from "../types/monitorSpec";

export type PipelineUIState = {
  pipeline: Array<{ pluginId: string; action: string }>;
  currentStepIndex?: number;
  currentStep?: { pluginId: string; action: string };
  modifiedSteps?: Array<{ pluginId: string; action: string }>;
  explanation?: string;
};

export interface MonitorState {
  connected: boolean;
  events: MonitorEvent[];
  agentState?: AgentStatePayload;
  pipelineState?: PipelineUIState;
}

type Action =
  | { type: "WS_CONNECTED" }
  | { type: "WS_DISCONNECTED" }
  | { type: "LOG_EVENT"; payload: MonitorEvent };

export function monitorReducer(
  state: MonitorState,
  action: Action
): MonitorState {
  switch (action.type) {
    case "WS_CONNECTED":
      return { ...state, connected: true };
    case "WS_DISCONNECTED":
      return { ...state, connected: false };
    case "LOG_EVENT": {
      const ev = action.payload;
      const events = [...state.events, ev].slice(-100);

      let agentState = state.agentState;
      let pipelineState = state.pipelineState;

      switch (ev.type) {
        case "state":
          agentState = (ev as StateUpdate).metadata.state;
          break;
        case "pipeline.generation.complete": {
          const meta = (ev as PipelineGenerationComplete).metadata;
          if (meta && meta.pipeline) {
            pipelineState = { pipeline: meta.pipeline, currentStepIndex: 0 };
          }
          break;
        }
        case "runtime.pipeline.step.executed": {
          const m = (ev as PipelineStepExecuted).metadata;
          pipelineState = pipelineState
            ? { ...pipelineState, currentStepIndex: m.currentStepIndex }
            : pipelineState;
          break;
        }
        case "runtime.pipeline.modification.applied": {
          const m = (ev as PipelineModificationApplied).metadata;
          pipelineState = {
            pipeline: m.pipeline,
            currentStep: m.currentStep,
            modifiedSteps: m.modifiedSteps,
            explanation: m.explanation
          };
          break;
        }
      }

      return { ...state, events, agentState, pipelineState };
    }
    default:
      return state;
  }
}
