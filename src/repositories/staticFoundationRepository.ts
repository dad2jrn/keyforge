import type { FoundationCapability, SecurityChecklistItem } from '../domain/foundation';
import type { FoundationRepository } from './foundationRepository';

export class StaticFoundationRepository implements FoundationRepository {
    async listCapabilities(): Promise<readonly FoundationCapability[]> {
        return [
            { label: 'Vite static app', status: 'ready', detail: 'Configured for GitHub Pages subpath deployment.' },
            { label: 'Strict TypeScript', status: 'ready', detail: 'Application and config code compile with strict checks.' },
            { label: 'Repository boundary', status: 'ready', detail: 'UI consumes services that depend on repository interfaces.' },
            { label: 'SQLite worker', status: 'planned', detail: 'Reserved for Epic 1; no React component imports SQLite.' },
        ];
    }

    async listSecurityChecklist(): Promise<readonly SecurityChecklistItem[]> {
        return [
            { control: 'Real data in repository', state: 'guarded', note: 'Forbidden by policy, .gitignore, hook, and CI scan.' },
            { control: 'Sensitive file extensions', state: 'guarded', note: 'Database, backup, CSV, and spreadsheet files are blocked.' },
            { control: 'Theme preference storage', state: 'ready', note: 'Allowed in localStorage because it is not master-key data.' },
            { control: 'Bittings and pinning', state: 'guarded', note: 'Demo interface uses masked synthetic placeholders only.' },
        ];
    }
}
