import { Logger } from "winston";

import logger from "../../../lib/logger";
import { OperationConfig } from "../../pipeline/operations";
import { ModelProvider } from "../../providers/model";
import { CapabilityRegistry } from "./capability";
import { ICapabilities } from "./capability/types";

/**
 * ModelManager is responsible for managing model instances and their capabilities
 */
export class ModelManager {
  private models: Map<string, ModelProvider>;
  private capabilityRegistry: CapabilityRegistry;
  private capabilityAliases: Map<string, string>;

  public get logger(): Logger {
    return logger.child({ scope: "model.manager" });
  }

  constructor(...models: ModelProvider[]) {
    this.models = new Map<string, ModelProvider>();
    this.capabilityRegistry = new CapabilityRegistry();
    this.capabilityAliases = new Map<string, string>();

    for (const model of models) {
      this.registerModel(model);
    }
  }

  /**
   * Register a model
   */
  private registerModel(modelProvider: ModelProvider): void {
    this.models.set(modelProvider.id, modelProvider);

    // Register all capabilities provided by the model
    const capabilities = modelProvider.getCapabilities();
    for (const capability of capabilities) {
      this.capabilityRegistry.registerCapability(
        modelProvider.id,
        capability.id
      );

      // Check if this capability already has a default model
      // If not, set this model as the default for this capability
      if (
        !this.capabilityRegistry.getDefaultModelForCapability(capability.id)
      ) {
        this.capabilityRegistry.setDefaultModelForCapability(
          capability.id,
          modelProvider.id
        );
        this.logger.debug(
          `set model provider ${modelProvider.id} as default for capability "${capability.id}"`,
          {
            type: "default.model.capability.set"
          }
        );
      }
    }

    this.logger.debug(
      `model provider "${modelProvider.id}" registered successfully`,
      {
        type: "model.provider.registered"
      }
    );
  }

  public async init(): Promise<void> {
    await Promise.all(
      Array.from(this.models.values()).map(async (modelProvider) => {
        try {
          await modelProvider.init();
          this.logger.debug(
            `model provider initialized successfully for "${modelProvider.id}"`,
            {
              type: "model.provider.initialization.success"
            }
          );
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err));
          this.logger.error(
            `model provider initialization failed for "${modelProvider.id}"`,
            {
              type: "model.provider.initialization.failed",
              error: error.message
            }
          );
        }
      })
    );
  }

  /**
   * Register a capability alias
   */
  public registerCapabilityAlias(alias: string, canonicalId: string): void {
    if (!this.capabilityRegistry.hasCapability(canonicalId)) {
      throw new Error(`Capability ${canonicalId} not found`);
    }
    this.capabilityAliases.set(alias, canonicalId);
    this.logger.debug(
      `registered capability alias "${alias}" for "${canonicalId}"`,
      {
        type: "model.capability.alias.registered",
        alias,
        canonicalId
      }
    );
  }

  /**
   * Execute a capability with the given input
   */
  public async executeCapability<K extends keyof ICapabilities>(
    capabilityId: K,
    input: ICapabilities[K]["input"],
    config?: OperationConfig,
    modelId?: string
  ): Promise<ICapabilities[K]["output"]> {
    // Resolve the canonical capability ID
    const resolvedCapabilityId =
      this.capabilityAliases.get(capabilityId as string) || capabilityId;

    // Get the effective model to use
    const effectiveModelId =
      modelId ||
      this.capabilityRegistry.getDefaultModelForCapability(
        resolvedCapabilityId as string
      );

    if (!effectiveModelId) {
      throw new Error(
        `No model specified and no default model set for capability ${resolvedCapabilityId}`
      );
    }

    const modelProvider = this.models.get(effectiveModelId);
    if (!modelProvider) {
      throw new Error(`Unknown model: ${effectiveModelId}`);
    }

    // Try to get the capability from the model
    const capability = modelProvider.getCapability(
      resolvedCapabilityId as string
    );
    if (!capability) {
      throw new Error(
        `Capability ${resolvedCapabilityId} not found on model ${modelProvider.id}`
      );
    }

    // Validate the input against the capability's input schema
    const validatedInput = capability.input.safeParse(input);
    if (!validatedInput.success) {
      throw new Error(
        `Invalid input for capability ${resolvedCapabilityId}: ${validatedInput.error}`
      );
    }
    const result = await capability.execute(validatedInput.data, config);
    return capability.output.parse(result) as ICapabilities[K]["output"];
  }

  /**
   * Get all available capabilities
   */
  public getAvailableCapabilities(): string[] {
    return this.capabilityRegistry.getAllCapabilities();
  }

  /**
   * Get all models that support a capability
   */
  public getModelsWithCapability(capabilityId: string): string[] {
    const resolvedId = this.capabilityAliases.get(capabilityId) || capabilityId;
    return this.capabilityRegistry.getModelsWithCapability(resolvedId);
  }

  /**
   * Set the default model for a capability
   */
  public setDefaultModelForCapability(
    capabilityId: string,
    modelId: string
  ): void {
    const resolvedId = this.capabilityAliases.get(capabilityId) || capabilityId;
    this.capabilityRegistry.setDefaultModelForCapability(resolvedId, modelId);
  }

  /**
   * Check if any model supports a capability
   */
  public hasCapability(capabilityId: string): boolean {
    const resolvedId = this.capabilityAliases.get(capabilityId) || capabilityId;
    return this.capabilityRegistry.hasCapability(resolvedId);
  }

  public async checkHealth(): Promise<void> {
    await Promise.all(
      Array.from(this.models.values()).map(async (model) => {
        try {
          await model.checkHealth();
          this.logger.debug(
            `health check for model provider ${model.id} passed`,
            {
              type: "model.healthcheck.passed"
            }
          );
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err));
          this.logger.error(
            `health check for model provider ${model.id} failed`,
            {
              type: "model.healthcheck.failed",
              error: error.message
            }
          );

          throw error;
        }
      })
    );
  }
}
