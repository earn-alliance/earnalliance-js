import type { NodeClientOptions } from '../src/types';

export const defaultOptions: NodeClientOptions = {
  batchSize: 2,
  clientId: '123',
  clientSecret: '123',
  dsn: 'https://0.0.0.0',
  flushEvents: [],
  gameId: '123',
  interval: 1000,
  maxRetryAttempts: 3,
};
