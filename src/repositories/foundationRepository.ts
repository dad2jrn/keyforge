import type { FoundationCapability, SecurityChecklistItem } from '../domain/foundation';

export interface FoundationRepository {
  listCapabilities(): Promise<readonly FoundationCapability[]>;
  listSecurityChecklist(): Promise<readonly SecurityChecklistItem[]>;
}
