export interface MigrationDefinition {
  readonly version: number;
  readonly description: string;
}

export const initialMigrationPlan: readonly MigrationDefinition[] = [
  { version: 1, description: 'Initial sync-ready local schema begins in Epic 1.' },
];
