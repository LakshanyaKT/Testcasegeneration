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

    this.client = new BedrockRuntimeClient({ region });

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
          maxTokens = 8192,
        } = options;

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

        const response = await this.client.send(command);

        const text = response.output?.message?.content?.[0]?.text;

        if (!text) {
          throw new Error(
            `Empty response from Bedrock: ${JSON.stringify(response.output).substring(0, 200)}`,
          );
        }

        return parseJsonFromLLMResponse<T>(text);
      },
      { maxRetries: 3, delayMs: 1000, backoffMultiplier: 2 },
      this.logger,
      'Bedrock Request',
    );
  }
}
