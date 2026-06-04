import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { withRetry } from '../utils/retry.util';
import { parseJsonFromLLMResponse } from '../utils/json-parser.util';

export interface LLMRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly client: BedrockRuntimeClient;
  private readonly modelId: string;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    this.modelId =
      process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-pro-v1:0';

    this.client = new BedrockRuntimeClient({
      region,
      requestHandler: {
        requestTimeout: 60_000, // 60 seconds timeout
      } as any,
    });

    this.logger.log(
      `Bedrock LLM Service initialized (region: ${region}, model: ${this.modelId})`,
    );
  }

  async generateStructuredResponse<T>(options: LLMRequestOptions): Promise<T> {
    return withRetry(
      async () => {
        const {
          systemPrompt,
          userPrompt,
          temperature = 0.1,
          maxTokens = 4096,
        } = options;

        this.logger.log(
          `Calling Bedrock (maxTokens: ${maxTokens}, prompt length: ${systemPrompt.length + userPrompt.length} chars)`,
        );

        const command = new ConverseCommand({
          modelId: this.modelId,
          system: [{ text: systemPrompt }],
          messages: [
            {
              role: 'user',
              content: [{ text: userPrompt }],
            },
          ],
          inferenceConfig: {
            temperature,
            maxTokens,
          },
        });

        const response = await this.client.send(command, {
          requestTimeout: 60_000,
        });

        const text = response.output?.message?.content?.[0]?.text;

        if (!text) {
          throw new Error(
            `Empty response from Bedrock: stopReason=${response.stopReason}, usage=${JSON.stringify(response.usage)}`,
          );
        }

        this.logger.log(
          `Bedrock response received (stopReason: ${response.stopReason}, tokens: ${response.usage?.outputTokens})`,
        );

        return parseJsonFromLLMResponse<T>(text);
      },
      { maxRetries: 3, delayMs: 2000, backoffMultiplier: 2 },
      this.logger,
      'Bedrock Request',
    );
  }
}
