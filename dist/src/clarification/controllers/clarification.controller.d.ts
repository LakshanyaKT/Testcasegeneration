import { ClarificationService } from '../services/clarification.service';
import { RespondClarificationDto, GenerateClarificationsResponseDto, GetClarificationsResponseDto, RespondClarificationResponseDto } from '../dto';
export declare class ClarificationController {
    private readonly clarificationService;
    private readonly logger;
    constructor(clarificationService: ClarificationService);
    generateClarifications(documentId: string): Promise<GenerateClarificationsResponseDto>;
    getClarifications(documentId: string): Promise<GetClarificationsResponseDto>;
    respondToClarification(clarificationId: string, dto: RespondClarificationDto): Promise<RespondClarificationResponseDto>;
}
