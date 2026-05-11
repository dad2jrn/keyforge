import { useLockState } from '../app/LockProvider';

export function LockButton() {
  const { isLocked, lock } = useLockState();

  return (
    <button className="btn btn-danger" type="button" onClick={lock} aria-label="Lock application shell">
      {isLocked ? 'Locked' : 'Lock App'}
    </button>
  );
}