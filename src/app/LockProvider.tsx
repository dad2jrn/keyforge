import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LockStatus } from './securityState';

export type SensitiveRevealKey = 'bitting-preview' | 'pinning-worksheet' | 'report-preview';

type LockContextValue = {
  readonly status: LockStatus;
  readonly isLocked: boolean;
  readonly autoLockTimeoutMs: number;
  readonly revealedKeys: ReadonlySet<SensitiveRevealKey>;
  readonly unlock: () => void;
  readonly lock: () => void;
  readonly reveal: (key: SensitiveRevealKey) => void;
  readonly mask: (key: SensitiveRevealKey) => void;
  readonly clearReveals: () => void;
  readonly resetAutoLockTimer: () => void;
};

const LockContext = createContext<LockContextValue | null>(null);

export function LockProvider({ children, autoLockTimeoutMs = 10 * 60 * 1000 }: { readonly children: ReactNode; readonly autoLockTimeoutMs?: number }) {
  const [status, setStatus] = useState<LockStatus>('locked');
  const [revealedKeys, setRevealedKeys] = useState<ReadonlySet<SensitiveRevealKey>>(() => new Set());
  const [activityTick, setActivityTick] = useState(0);

  const clearReveals = useCallback(() => setRevealedKeys(new Set()), []);

  const lock = useCallback(() => {
    clearReveals();
    setStatus('locked');
  }, [clearReveals]);

  const unlock = useCallback(() => setStatus('unlocked'), []);

  const reveal = useCallback((key: SensitiveRevealKey) => {
    setRevealedKeys((currentKeys) => new Set([...currentKeys, key]));
  }, []);

  const mask = useCallback((key: SensitiveRevealKey) => {
    setRevealedKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      nextKeys.delete(key);
      return nextKeys;
    });
  }, []);

  const resetAutoLockTimer = useCallback(() => setActivityTick((currentTick) => currentTick + 1), []);

  useEffect(() => {
    if (status === 'locked' || autoLockTimeoutMs <= 0) return undefined;

    const timeoutId = window.setTimeout(lock, autoLockTimeoutMs);
    return () => window.clearTimeout(timeoutId);
  }, [activityTick, autoLockTimeoutMs, lock, status]);

  const value = useMemo<LockContextValue>(() => ({
    status,
    isLocked: status === 'locked',
    autoLockTimeoutMs,
    revealedKeys,
    unlock,
    lock,
    reveal,
    mask,
    clearReveals,
    resetAutoLockTimer,
  }), [autoLockTimeoutMs, clearReveals, lock, mask, reveal, revealedKeys, resetAutoLockTimer, status, unlock]);

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}

export function useLockState(): LockContextValue {
  const context = useContext(LockContext);
  if (!context) throw new Error('useLockState must be used within LockProvider');
  return context;
}