import type { IEvent, ITraits } from './types';

export function track(userId: string, eventName: string, valueOrTraits?: number | ITraits, traits?: ITraits): IEvent {
  const timestamp = new Date().toISOString();

  return {
    userId,
    timestamp,
    event: eventName,
    value: typeof valueOrTraits === 'object' ? undefined : valueOrTraits,
    traits: typeof valueOrTraits === 'object' ? valueOrTraits : traits,
  };
}
