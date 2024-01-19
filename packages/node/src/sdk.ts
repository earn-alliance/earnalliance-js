import { NodeClient } from './client';
import { DEFAULT_BATCH_SIZE, DEFAULT_INTERVAL, DEFAULT_MAX_RETRY_ATTEMPTS } from './constants';
import type { NodeClientOptions, NodeOptions } from './types';

export function init(options: NodeOptions = {}): NodeClient {
  if (options.clientId === undefined && process.env.ALLIANCE_CLIENT_ID) {
    options.clientId = process.env.ALLIANCE_CLIENT_ID;
  }

  if (options.clientSecret === undefined && process.env.ALLIANCE_CLIENT_SECRET) {
    options.clientSecret = process.env.ALLIANCE_CLIENT_SECRET;
  }

  if (!options.dsn) {
    options.dsn = process.env.ALLIANCE_DSN || 'https://events.earnalliance.com/v2/custom-events';
  }

  if (options.gameId === undefined && process.env.ALLIANCE_GAME_ID) {
    options.gameId = process.env.ALLIANCE_GAME_ID;
  }

  const {
    batchSize = DEFAULT_BATCH_SIZE,
    clientId,
    clientSecret,
    dsn,
    flushEvents = [],
    gameId,
    interval = DEFAULT_INTERVAL,
    maxRetryAttempts = DEFAULT_MAX_RETRY_ATTEMPTS,
  } = options;

  if (!clientId || !clientSecret || !dsn || !gameId) {
    throw new Error('Missing required client options');
  }

  const clientOptions: NodeClientOptions = {
    batchSize,
    clientId,
    clientSecret,
    dsn,
    flushEvents,
    gameId,
    interval,
    maxRetryAttempts,
  };

  return new NodeClient(clientOptions);
}
