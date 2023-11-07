import { FLUSH_COOLDOWN } from '../constants';
import type { HTTPTransporter } from '../transporters/http';
import type { IEvent, IIdentifier, IQueueItem, NodeClientOptions } from '../types';
import { EnumQueueItemType } from '../types';

export class BatchProcessor {
  /** Options passed to the SDK. */
  protected readonly _options: NodeClientOptions;

  private _queue: IQueueItem[];

  private _timer?: NodeJS.Timeout;

  private _flushTimer?: NodeJS.Timeout;

  private _lastFlush: number;

  private _transporter: HTTPTransporter;

  public constructor(transporter: HTTPTransporter, options: NodeClientOptions) {
    this._transporter = transporter;
    this._options = options;

    this._queue = [];
    this._lastFlush = 0;
  }

  public async addEvent(event: IEvent): Promise<void> {
    this._queue.push({ type: EnumQueueItemType.Event, event });

    if (this._options.flushEvents.includes(event.event)) {
      await this.flush();
      return;
    }

    await this.scheduleBatch();
  }

  public async addIdentifier(identifier: IIdentifier): Promise<void> {
    this._queue.push({ type: EnumQueueItemType.Identifier, identifier });

    await this.flush();
  }

  public async scheduleBatch(): Promise<void> {
    if (this._queue.length >= this._options.batchSize) {
      await this.process();
      return;
    }

    if (!this._timer) {
      this._timer = setTimeout(async () => {
        await this.process();
      }, this._options.interval);
    }
  }

  public async flush(): Promise<void> {
    if (this._flushTimer) return;

    const now = Date.now().valueOf();
    const timeSinceLastFlush = now - this._lastFlush;

    if (timeSinceLastFlush >= FLUSH_COOLDOWN) {
      this._lastFlush = now;
      await this.process();
      return;
    }

    this._flushTimer = setTimeout(async () => {
      await this.process();
    }, FLUSH_COOLDOWN - timeSinceLastFlush);
  }

  public async process(): Promise<void> {
    this.clearTimer();

    const batch = this._queue.splice(0, this._options.batchSize);

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
      gameId: this._options.gameId,
      events,
      identifiers,
    };

    try {
      await this._transporter.send(payload);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  public clearTimer(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }

    if (this._flushTimer) {
      clearTimeout(this._flushTimer);
      this._flushTimer = undefined;
    }
  }
}
