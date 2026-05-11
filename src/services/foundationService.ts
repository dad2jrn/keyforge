import type { FoundationCapability, SecurityChecklistItem } from '../domain/foundation';
import type { FoundationRepository } from '../repositories/foundationRepository';

export interface FoundationSummary {
    readonly capabilities: readonly FoundationCapability[];
    readonly securityChecklist: readonly SecurityChecklistItem[];
}

export class FoundationService {
    constructor(private readonly repository: FoundationRepository) {}

    async getSummary(): Promise<FoundationSummary> {
        const [capabilities, securityChecklist] = await Promise.all([
            this.repository.listCapabilities(),
            this.repository.listSecurityChecklist(),
        ]);

        return { capabilities, securityChecklist };
    }
}
