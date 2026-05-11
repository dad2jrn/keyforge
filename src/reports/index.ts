export interface ReportDescriptor {
  readonly title: string;
  readonly sensitivity: 'internal' | 'restricted' | 'critical';
}
