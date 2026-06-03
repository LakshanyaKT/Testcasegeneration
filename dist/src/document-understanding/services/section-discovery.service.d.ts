import { Section } from '../interfaces';
export declare class SectionDiscoveryService {
    private readonly logger;
    discoverSections(markdown: string): Section[];
    private extractRawSections;
    private detectPageRange;
}
