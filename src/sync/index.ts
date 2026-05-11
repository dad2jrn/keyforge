export interface SyncPosture {
  readonly version: 1;
  readonly mode: 'local-only';
  readonly futureAdapter: 'cloudflare-worker-d1';
}

export const syncPosture: SyncPosture = {
  version: 1,
  mode: 'local-only',
  futureAdapter: 'cloudflare-worker-d1',
};
