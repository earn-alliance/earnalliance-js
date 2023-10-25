import type { BatchProcessorOptions, IEvent, IIdentifier } from '../types';
export declare class BatchProcessor {
    private _queue;
    private _interval;
    private _batchSize;
    private _gameId;
    private _timer?;
    private _transporter;
    constructor(options: BatchProcessorOptions);
    addEvent(event: IEvent): Promise<void>;
    addIdentifier(identifier: IIdentifier): Promise<void>;
    scheduleBatch(): Promise<void>;
    process(): Promise<void>;
}
//# sourceMappingURL=batch-processor.d.ts.map