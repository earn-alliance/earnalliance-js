import type { HTTPTransporterOptions } from '../types';
export declare class HTTPTransporter {
    private _options;
    private _maxRetryAttempts;
    constructor(options: HTTPTransporterOptions);
    send(payload: Record<string, unknown>, attempt?: number): Promise<boolean>;
    private _sign;
    private _retry;
}
//# sourceMappingURL=http.d.ts.map