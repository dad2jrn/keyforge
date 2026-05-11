import type { DatabaseDiagnostics } from '../domain/database';

export type SqliteWorkerRequest =
    | { readonly id: number; readonly type: 'diagnostics' };

export type SqliteWorkerSuccessResponse =
    | { readonly id: number; readonly ok: true; readonly type: 'diagnostics'; readonly payload: DatabaseDiagnostics };

export interface SqliteWorkerErrorResponse {
    readonly id: number;
    readonly ok: false;
    readonly error: string;
}

export type SqliteWorkerResponse = SqliteWorkerSuccessResponse | SqliteWorkerErrorResponse;

export type SqliteWorkerResponseFor<TRequest extends SqliteWorkerRequest> = Extract<
    SqliteWorkerSuccessResponse,
    { readonly type: TRequest['type'] }
>['payload'];