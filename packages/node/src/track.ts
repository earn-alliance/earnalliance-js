import type { IEvent, ITraits } from './types';

export function track(userId: string, eventName: string, valueOrTraits?: number | ITraits, traits?: ITraits): IEvent {
  const time = new Date().toISOString();

  return {
    userId,
    time,
    event: eventName,
    value: typeof valueOrTraits === 'object' ? undefined : valueOrTraits,
    traits: typeof valueOrTraits === 'object' ? valueOrTraits : traits,
  };
}
