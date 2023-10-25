import crypto from 'crypto';

import type { BatchProcessor } from './processors/batch-processor';
import { track } from './track';
import type { ITraits } from './types';

export class Round {
  protected readonly _groupId: string;

  protected readonly _processor: BatchProcessor;

  public constructor(processor: BatchProcessor, groupId?: string) {
    this._processor = processor;
    this._groupId = groupId ?? crypto.randomUUID();
  }

  public async track(
    userId: string,
    eventName: string,
    valueOrTraits?: number | ITraits,
    traits?: ITraits,
  ): Promise<void> {
    const event = track(userId, eventName, valueOrTraits, traits);
    return this._processor.addEvent({ ...event, groupId: this._groupId });
  }
}
