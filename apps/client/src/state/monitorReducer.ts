import {
  AgentStatePayload,
  MonitorEvent,
  StateUpdate
} from "../types/monitorSpec";

export type PipelineUIState = {
  pipeline: {
    steps: Array<{ pluginId: string; action: string }>;
    relatedMemories: string;
  };
  currentStepIndex?: number;
  currentStep?: { pluginId: string; action: string };
  modifiedSteps?: Array<{ pluginId: string; action: string }>;
  explanation?: string;
  isRunning?: boolean;
  modificationCheckInProgress?: boolean;
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

      if (ev.type === "state") {
        const metaState = (ev as StateUpdate).metadata.state;
        agentState = {
          ...agentState,
          ...metaState,
          // Preserve existing queueLength if the snapshot omits it (undefined)
          queueLength:
            metaState.queueLength !== undefined
              ? metaState.queueLength
              : agentState?.queueLength
        } as AgentStatePayload;

        // derive pipeline UI state if available
        if (metaState.pipeline) {
          pipelineState = {
            pipeline: {
              steps: metaState.pipeline,
              relatedMemories: metaState.relatedMemories ?? ""
            },
            currentStepIndex: metaState.currentStepIndex,
            currentStep: metaState.currentStep,
            modifiedSteps: metaState.modifiedSteps,
            explanation: metaState.explanation,
            isRunning: metaState.isRunning,
            modificationCheckInProgress: metaState.modificationCheckInProgress
          };
        }
      }

      return { ...state, events, agentState, pipelineState };
    }
    default:
      return state;
  }
}
