import { describe, expect, it } from 'vitest';
import { SqliteWorkerClient } from './sqliteClient';
import type { SqliteWorkerResponse } from './sqliteProtocol';

type Listener = (event: MessageEvent<SqliteWorkerResponse>) => void;

class FakeWorker implements Pick<Worker, 'addEventListener' | 'removeEventListener' | 'postMessage' | 'terminate'> {
    readonly postedMessages: unknown[] = [];
    terminated = false;
    private messageListener: Listener | null = null;
    private errorListener: ((event: Event) => void) | null = null;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
        if (type === 'message') {
            this.messageListener = listener as Listener;
        }
        if (type === 'error') {
            this.errorListener = listener as (event: Event) => void;
        }
    }

    removeEventListener(type: string): void {
        if (type === 'message') this.messageListener = null;
        if (type === 'error') this.errorListener = null;
    }

    postMessage(message: unknown): void {
        this.postedMessages.push(message);
    }

    terminate(): void {
        this.terminated = true;
    }

    respond(response: SqliteWorkerResponse): void {
        this.messageListener?.({ data: response } as MessageEvent<SqliteWorkerResponse>);
    }

    fail(message = 'worker failed'): void {
        this.errorListener?.({ message } as ErrorEvent);
    }
}

describe('SqliteWorkerClient', () => {
    it('posts a typed diagnostics request and resolves the matching response payload', async () => {
        const worker = new FakeWorker();
        const client = new SqliteWorkerClient(() => worker as unknown as Worker);

        const diagnosticsPromise = client.getDiagnostics();

        expect(worker.postedMessages).toEqual([{ id: 1, type: 'diagnostics' }]);

        worker.respond({
            id: 1,
            ok: true,
            type: 'diagnostics',
            payload: {
                status: 'ready',
                sqliteVersion: '3.53.0',
                testQueryValue: 2,
                compatibility: {
                    opfsAvailable: false,
                    crossOriginIsolated: false,
                    workerAvailable: true,
                    warnings: [],
                },
                error: null,
            },
        });

        await expect(diagnosticsPromise).resolves.toMatchObject({ sqliteVersion: '3.53.0', testQueryValue: 2 });
    });

    it('rejects pending diagnostics requests with readable worker errors', async () => {
        const worker = new FakeWorker();
        const client = new SqliteWorkerClient(() => worker as unknown as Worker);

        const diagnosticsPromise = client.getDiagnostics();
        worker.respond({ id: 1, ok: false, error: 'SQLite WASM is unsupported in this browser.' });

        await expect(diagnosticsPromise).rejects.toThrow('SQLite WASM is unsupported in this browser.');
    });

    it('rejects all pending requests when the worker boundary fails', async () => {
        const worker = new FakeWorker();
        const client = new SqliteWorkerClient(() => worker as unknown as Worker);

        const diagnosticsPromise = client.getDiagnostics();
        worker.fail('SQLite worker failed before initialization.');

        await expect(diagnosticsPromise).rejects.toThrow('SQLite worker failed before initialization.');
    });
});
