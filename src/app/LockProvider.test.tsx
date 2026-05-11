import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LockProvider, useLockState } from './LockProvider';

describe('LockProvider', () => {
  it('clears sensitive reveal state when the shell locks', async () => {
    const user = userEvent.setup();

    render(
      <LockProvider>
        <Harness />
      </LockProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'unlock' }));
    await user.click(screen.getByRole('button', { name: 'reveal' }));

    expect(screen.getByText('revealed')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'lock' }));

    expect(screen.getByText('masked')).toBeInTheDocument();
    expect(screen.getByText('locked')).toBeInTheDocument();
  });
});

function Harness() {
  const { status, revealedKeys, unlock, lock, reveal } = useLockState();

  return (
    <div>
      <div>{status}</div>
      <div>{revealedKeys.has('bitting-preview') ? 'revealed' : 'masked'}</div>
      <button type="button" onClick={unlock}>unlock</button>
      <button type="button" onClick={() => reveal('bitting-preview')}>reveal</button>
      <button type="button" onClick={lock}>lock</button>
    </div>
  );
}