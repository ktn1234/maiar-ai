/*
 * Canonical monitor-event definitions (v0)
 * NOTE: duplicated inside the maiar client until we extract a shared package.
 */

export interface BaseEvent {
  /**
   * Canonical event identifier string.
   * Example: "pipeline.generation.complete".
   */
  type: string;
  /** Human readable message */
  message: string;
  /** epoch-ms timestamp */
  timestamp: number;
  /** additional payload */
  metadata?: Record<string, unknown>;
}

/* ────────────────────────────
 * Pipeline events
 * ────────────────────────────*/
export interface PipelineGenerationComplete extends BaseEvent {
  type: "pipeline.generation.complete";
  metadata: {
    pipeline: {
      steps: Array<{ pluginId: string; action: string }>;
      relatedMemories: string;
    };
    currentStepIndex: number;
  };
}

export interface PipelineStepExecuted extends BaseEvent {
  type: "runtime.pipeline.step.executed";
  metadata: {
    pipeline: Array<{ pluginId: string; action: string }>;
    currentStep: { pluginId: string; action: string };
    currentStepIndex: number;
  };
}

export interface PipelineModificationApplied extends BaseEvent {
  type: "runtime.pipeline.modification.applied";
  metadata: {
    explanation: string;
    modifiedSteps: Array<{ pluginId: string; action: string }>;
    currentStep: { pluginId: string; action: string };
    pipeline: Array<{ pluginId: string; action: string }>;
  };
}

/* ────────────────────────────
 * Agent-state updates
 * ────────────────────────────*/
export interface AgentStatePayload {
  queueLength: number;
  isRunning: boolean;
  lastUpdate: number;
  currentContext?: unknown;
}

export interface StateUpdate extends BaseEvent {
  type: "state";
  metadata: {
    state: AgentStatePayload;
  };
}

/* ────────────────────────────
 * Export union for convenience
 * ────────────────────────────*/
export type MonitorEvent =
  | PipelineGenerationComplete
  | PipelineStepExecuted
  | PipelineModificationApplied
  | StateUpdate
  | BaseEvent;
