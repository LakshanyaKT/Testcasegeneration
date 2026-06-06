"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LLMService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const common_1 = require("@nestjs/common");
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const node_http_handler_1 = require("@smithy/node-http-handler");
const retry_util_1 = require("../utils/retry.util");
const json_parser_util_1 = require("../utils/json-parser.util");
let LLMService = LLMService_1 = class LLMService {
    constructor() {
        this.logger = new common_1.Logger(LLMService_1.name);
        const region = process.env.AWS_REGION || 'us-east-1';
        this.modelId =
            process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-pro-v1:0';
        this.client = new client_bedrock_runtime_1.BedrockRuntimeClient({
            region,
            requestHandler: new node_http_handler_1.NodeHttpHandler({
                connectionTimeout: 10_000,
                requestTimeout: 180_000,
                socketTimeout: 180_000,
            }),
        });
        this.logger.log(`Bedrock LLM Service initialized (region: ${region}, model: ${this.modelId})`);
    }
    async generateStructuredResponse(options) {
        return (0, retry_util_1.withRetry)(async () => {
            const { systemPrompt, userPrompt, temperature = 0.1, maxTokens = 4096, } = options;
            this.logger.log(`Calling Bedrock (maxTokens: ${maxTokens}, prompt length: ${systemPrompt.length + userPrompt.length} chars)`);
            const command = new client_bedrock_runtime_1.ConverseCommand({
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
                throw new Error(`Empty response from Bedrock: stopReason=${response.stopReason}, usage=${JSON.stringify(response.usage)}`);
            }
            this.logger.log(`Bedrock response received (stopReason: ${response.stopReason}, tokens: ${response.usage?.outputTokens})`);
            return (0, json_parser_util_1.parseJsonFromLLMResponse)(text);
        }, { maxRetries: 3, delayMs: 2000, backoffMultiplier: 2 }, this.logger, 'Bedrock Request');
    }
};
exports.LLMService = LLMService;
exports.LLMService = LLMService = LLMService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LLMService);
//# sourceMappingURL=llm.service.js.map