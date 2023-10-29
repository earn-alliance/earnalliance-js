import { track } from '../src/track';

describe('track', () => {
  test('when tracking event name only', () => {
    const event = track('1-2-3-4', 'CUSTOM_EVENT');

    expect(Object.keys(event).sort()).toEqual(['event', 'time', 'userId']);
    expect(event.event).toEqual('CUSTOM_EVENT');
    expect(event.userId).toEqual('1-2-3-4');
  });

  test('when tracking event with value', () => {
    const event = track('1-2-3-5', 'SCORE', 100);

    expect(Object.keys(event).sort()).toEqual(['event', 'time', 'userId', 'value']);
    expect(event.event).toEqual('SCORE');
    expect(event.userId).toEqual('1-2-3-5');
    expect(event.value).toEqual(100);
  });

  test('when tracking event with traits', () => {
    const event = track('1-2-3-6', 'COLLECT', { item: 'rock' });

    expect(Object.keys(event).sort()).toEqual(['event', 'time', 'traits', 'userId']);
    expect(event.event).toEqual('COLLECT');
    expect(event.traits).toEqual({ item: 'rock' });
    expect(event.userId).toEqual('1-2-3-6');
  });

  test('when tracking event with value and traits', () => {
    const event = track('1-2-3-7', 'DAMAGE_TAKEN', 666, { enemy: 'devil' });

    expect(Object.keys(event).sort()).toEqual(['event', 'time', 'traits', 'userId', 'value']);
    expect(event.event).toEqual('DAMAGE_TAKEN');
    expect(event.traits).toEqual({ enemy: 'devil' });
    expect(event.userId).toEqual('1-2-3-7');
    expect(event.value).toEqual(666);
  });
});
