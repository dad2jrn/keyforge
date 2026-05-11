import { useLockState } from '../app/LockProvider';

export function UnlockPage({ returnTo, onUnlocked }: { readonly returnTo: string; readonly onUnlocked: (route: string) => void }) {
  const { unlock } = useLockState();

  const handleUnlock = () => {
    unlock();
    onUnlocked(returnTo);
  };

  return (
    <section className="unlock-page" aria-labelledby="unlock-title">
      <div className="card unlock-card stack">
        <div>
          <span className="chip chip-warning">Security shell locked</span>
          <h1 id="unlock-title" className="page-title">Unlock KeyForge Local</h1>
          <p className="help-text">
            Placeholder unlock gate for protected screens. This does not store or persist a vault password.
          </p>
        </div>

        <div className="callout callout-warning">
          Full vault password verification is intentionally out of scope for this shell. Unlock only flips in-memory UI state.
        </div>

        <button className="btn btn-primary" type="button" onClick={handleUnlock}>Unlock shell</button>
      </div>
    </section>
  );
}