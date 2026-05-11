import type { DatabaseDiagnostics } from '../domain/database';
import type { SqliteWorkerRequest, SqliteWorkerResponse, SqliteWorkerResponseFor } from './sqliteProtocol';

export interface DatabaseClient {
    getDiagnostics(): Promise<DatabaseDiagnostics>;
}

type PendingRequest = {
    readonly resolve: (value: unknown) => void;
    readonly reject: (reason?: unknown) => void;
};

export class SqliteWorkerClient implements DatabaseClient {
    private readonly worker: Worker;
    private readonly pendingRequests = new Map<number, PendingRequest>();
    private nextRequestId = 1;

    constructor(workerFactory: () => Worker = createSqliteWorker) {
        this.worker = workerFactory();
        this.worker.addEventListener('message', this.handleMessage);
        this.worker.addEventListener('error', this.handleWorkerError);
        this.worker.addEventListener('messageerror', this.handleWorkerError);
    }

    getDiagnostics(): Promise<DatabaseDiagnostics> {
        return this.request({ id: this.nextRequestId, type: 'diagnostics' });
    }

    dispose(): void {
        this.worker.removeEventListener('message', this.handleMessage);
        this.worker.removeEventListener('error', this.handleWorkerError);
        this.worker.removeEventListener('messageerror', this.handleWorkerError);
        this.worker.terminate();
    }

    private request<TRequest extends SqliteWorkerRequest>(request: TRequest): Promise<SqliteWorkerResponseFor<TRequest>> {
        const id = this.nextRequestId;
        this.nextRequestId += 1;
        const outboundRequest = { ...request, id };

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve: resolve as (value: unknown) => void, reject });
            this.worker.postMessage(outboundRequest);
        });
    }

    private readonly handleMessage = (event: MessageEvent<SqliteWorkerResponse>): void => {
        const response = event.data;
        const pending = this.pendingRequests.get(response.id);
        if (!pending) {
            return;
        }

        this.pendingRequests.delete(response.id);
        if (response.ok) {
            pending.resolve(response.payload);
        } else {
            pending.reject(new Error(response.error));
        }
    };

    private readonly handleWorkerError = (event: Event | ErrorEvent | MessageEvent): void => {
        const message = 'message' in event && typeof event.message === 'string'
            ? event.message
            : 'SQLite worker failed.';
        for (const [, pending] of this.pendingRequests) {
            pending.reject(new Error(message));
        }
        this.pendingRequests.clear();
    };
}

function createSqliteWorker(): Worker {
    return new Worker(new URL('../workers/sqliteWorker.ts', import.meta.url), { type: 'module' });
}