import type { HTTPTransporter } from '../transporters/http';
import type { BatchProcessorOptions, IEvent } from '../types';

export class BatchProcessor {
  private _eventQueue: IEvent[];

  private _interval: number;

  private _batchSize: number;

  private _maxQueueSize: number;

  private _isRunning: boolean;

  private _timer?: NodeJS.Timeout;

  private _transporter: HTTPTransporter;

  public constructor(options: BatchProcessorOptions) {
    this._eventQueue = [];
    this._isRunning = false;
    this._transporter = options.transporter;

    this._batchSize = options.batchSize || 100;
    this._interval = options.interval || 1_000;
    this._maxQueueSize = options.maxQueueSize || 10_000;
  }

  public addEvent(evt: IEvent): boolean {
    if (this._eventQueue.length >= this._maxQueueSize) return false;

    this._eventQueue.push(evt);
    return true;
  }

  public start(): boolean {
    if (this._isRunning) return false;

    this._isRunning = true;

    this._timer = setTimeout(() => {
      this._run();
    }, this._interval);

    return true;
  }

  private _run(): void {}
}
