import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the Version 1 app shell dashboard without loading real data services', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Version 1 modules' })).toBeInTheDocument();
    expect(screen.getByText('Version 1 App Shell')).toBeInTheDocument();
    expect(screen.getByText(/Placeholder pages use synthetic labels only/)).toBeInTheDocument();
    expect(screen.queryByText('SQLite Engine Diagnostics')).not.toBeInTheDocument();
  });

  it.each([
    ['#/customers-sites', 'Customers / Sites'],
    ['#/key-systems', 'Key Systems'],
    ['#/cylinders', 'Cylinders'],
    ['#/pin-calculator', 'Pin Calculator'],
    ['#/keyholders', 'Keyholders'],
    ['#/settings', 'Settings'],
  ])('renders the %s route placeholder without runtime errors', (hash, heading) => {
    window.location.hash = hash;

    render(<App />);

    expect(screen.getByRole('heading', { name: heading, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: heading, level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });

  it.each([
    ['#/reports', 'Reports'],
    ['#/backup-security', 'Backup / Security'],
  ])('redirects protected %s route placeholders to unlock until unlocked', async (hash, heading) => {
    window.location.hash = hash;

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Unlock KeyForge Local' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: heading, level: 2 })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Unlock shell' }));

    expect(await screen.findByRole('heading', { name: heading, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: heading, level: 2 })).toBeInTheDocument();
  });

  it('manual lock is always accessible and returns protected placeholders to the unlock screen', async () => {
    window.location.hash = '#/reports';

    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'Unlock shell' }));
    expect(await screen.findByRole('heading', { name: 'Reports', level: 2 })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Lock application shell' }));

    expect(await screen.findByRole('heading', { name: 'Unlock KeyForge Local' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Reports', level: 2 })).not.toBeInTheDocument();
  });
});
