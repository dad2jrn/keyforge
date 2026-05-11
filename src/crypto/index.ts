export interface BackupFormatMetadata {
  readonly format: 'MKDB';
  readonly formatVersion: 1;
  readonly appName: 'KeyForge Local';
}

export const backupFormatMetadata: BackupFormatMetadata = {
  format: 'MKDB',
  formatVersion: 1,
  appName: 'KeyForge Local',
};
