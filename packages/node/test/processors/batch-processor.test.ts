import { BatchProcessor } from '../../src/processors/batch-processor';
import type { HTTPTransporter } from '../../src/transporters/http';
import { defaultOptions } from '../utils';

describe('BatchProcessor', () => {
  const mockTransporter = {
    send: jest.fn(),
  } as unknown as HTTPTransporter;

  test('when adding an identifier, calls flush to process the event quickly', async () => {
    const processor = new BatchProcessor(mockTransporter, defaultOptions);
    processor.flush = jest.fn();
    processor.scheduleBatch = jest.fn();

    await processor.addIdentifier({
      userId: '1-2-3-4',
      email: '',
    });

    expect(processor.flush).toHaveBeenCalled();
    expect(processor.scheduleBatch).not.toHaveBeenCalled();
  });

  test('when adding an event, calls scheduleBatch to queue the processing', async () => {
    const processor = new BatchProcessor(mockTransporter, defaultOptions);
    processor.flush = jest.fn();
    processor.scheduleBatch = jest.fn();

    await processor.addEvent({
      event: 'CUSTOM_EVENT',
      userId: '1-2-3-4',
      time: new Date().toISOString(),
    });

    expect(processor.flush).not.toHaveBeenCalled();
    expect(processor.scheduleBatch).toHaveBeenCalled();
  });

  test('when adding events that meets the batch size, calls process once immediately', async () => {
    const processor = new BatchProcessor(mockTransporter, { ...defaultOptions, batchSize: 3 });
    processor.process = jest.fn();

    const time = new Date().toISOString();
    await processor.addEvent({ event: 'CUSTOM_EVENT', userId: '1-2-3-4', time });
    await processor.addEvent({ event: 'CUSTOM_EVENT', userId: '1-2-3-4', time });
    expect(processor.process).not.toHaveBeenCalled();

    await processor.addEvent({ event: 'CUSTOM_EVENT', userId: '1-2-3-4', time });
    expect(processor.process).toHaveBeenCalled();
  });

  test('when adding an event that is configured to be flushed, calls flush to process the event quickly', async () => {
    const processor = new BatchProcessor(mockTransporter, { ...defaultOptions, flushEvents: ['CUSTOM_EVENT'] });
    processor.flush = jest.fn();
    processor.scheduleBatch = jest.fn();

    await processor.addEvent({
      event: 'CUSTOM_EVENT',
      userId: '1-2-3-4',
      time: new Date().toISOString(),
    });

    expect(processor.flush).toHaveBeenCalled();
    expect(processor.scheduleBatch).not.toHaveBeenCalled();
  });

  test('when calling flush twice in quick succession, it only calls process once because of cooldown', async () => {
    const processor = new BatchProcessor(mockTransporter, defaultOptions);
    processor.process = jest.fn();

    await processor.flush();
    await processor.flush();

    expect(processor.process).toHaveBeenCalledTimes(1);

    processor.clearTimer();
  });

  test('when process is called, it sends the event queue to the transporter', async () => {
    const processor = new BatchProcessor(mockTransporter, defaultOptions);

    processor.flush = jest.fn();
    processor.scheduleBatch = jest.fn();

    const time = new Date().toISOString();
    await processor.addEvent({
      event: 'CUSTOM_EVENT',
      userId: '1-2-3-4',
      time,
    });

    await processor.addIdentifier({
      userId: '1-2-3-4',
      email: '',
    });

    await processor.process();

    expect(mockTransporter.send).toHaveBeenCalledWith({
      events: [{ event: 'CUSTOM_EVENT', time, userId: '1-2-3-4' }],
      gameId: '123',
      identifiers: [{ email: '', userId: '1-2-3-4' }],
    });
  });
});
