import type { IEvent, ITraits } from './types';

export function track(userId: string, eventName: string, value?: number, traits?: ITraits): IEvent {
  const timestamp = new Date().toISOString();

  return {
    userId,
    timestamp,
    event: eventName,
    value,
    traits,
  };
}
