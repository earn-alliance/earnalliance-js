import type { IEvent, ITraits } from './types';

export function track(userId: string, eventName: string, valueOrTraits?: number | ITraits, traits?: ITraits): IEvent {
  const time = new Date().toISOString();

  const event: IEvent = { userId, time, event: eventName };

  if (typeof valueOrTraits === 'number') event.value = valueOrTraits;
  if (typeof valueOrTraits === 'object') event.traits = valueOrTraits;
  if (typeof traits === 'object') event.traits = traits;

  return event;
}
