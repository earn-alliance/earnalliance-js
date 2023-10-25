import type { HTTPTransporter } from '../transporters/http';
import type { BatchProcessorOptions, IEvent, IIdentifier, IQueueItem } from '../types';
import { EnumQueueItemType } from '../types';

export class BatchProcessor {
  private _queue: IQueueItem[];

  private _interval: number;

  private _batchSize: number;

  private _gameId: string;

  private _timer?: NodeJS.Timeout;

  private _transporter: HTTPTransporter;

  public constructor(options: BatchProcessorOptions) {
    this._queue = [];
    this._gameId = options.gameId;
    this._transporter = options.transporter;

    this._batchSize = options.batchSize || 100;
    this._interval = options.interval || 30_000;
  }

  public async addEvent(event: IEvent): Promise<void> {
    this._queue.push({ type: EnumQueueItemType.Event, event });

    await this.scheduleBatch();
  }

  public async addIdentifier(identifier: IIdentifier): Promise<void> {
    this._queue.push({ type: EnumQueueItemType.Identifier, identifier });

    await this.scheduleBatch();
  }

  public async scheduleBatch(): Promise<void> {
    if (this._queue.length >= this._batchSize) {
      await this.process();
      return;
    }

    if (!this._timer) {
      this._timer = setTimeout(async () => {
        await this.process();
      }, this._interval);
    }
  }

  public async process(): Promise<void> {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }

    const batch = this._queue.splice(0, this._batchSize);

    const events: IEvent[] = [];
    const identifiers: IIdentifier[] = [];

    batch.forEach(item => {
      if (item.type === EnumQueueItemType.Event) {
        events.push(item.event);
      }
      if (item.type === EnumQueueItemType.Identifier) {
        identifiers.push(item.identifier);
      }
    });

    const payload = {
      gameId: this._gameId,
      events,
      identifiers,
    };

    try {
      await this._transporter.send(payload);
    } catch (err) {
      // console.log(err)
    }
  }
}
