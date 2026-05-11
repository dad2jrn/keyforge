import type { DatabaseDiagnostics, DiagnosticWriteResult, TransactionProbeResult } from '../domain/database';

export type SqliteWorkerRequest =
    | { readonly id: number; readonly type: 'diagnostics' }
    | { readonly id: number; readonly type: 'recordDiagnosticWrite'; readonly message: string }
    | { readonly id: number; readonly type: 'runRollbackProbe' };

export type SqliteWorkerSuccessResponse =
    | { readonly id: number; readonly ok: true; readonly type: 'diagnostics'; readonly payload: DatabaseDiagnostics }
    | { readonly id: number; readonly ok: true; readonly type: 'recordDiagnosticWrite'; readonly payload: DiagnosticWriteResult }
    | { readonly id: number; readonly ok: true; readonly type: 'runRollbackProbe'; readonly payload: TransactionProbeResult };

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