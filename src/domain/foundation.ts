export type FoundationStatus = 'ready' | 'planned' | 'guarded';

export interface FoundationCapability {
  readonly label: string;
  readonly status: FoundationStatus;
  readonly detail: string;
}

export interface SecurityChecklistItem {
  readonly control: string;
  readonly state: FoundationStatus;
  readonly note: string;
}
