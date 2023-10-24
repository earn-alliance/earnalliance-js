import { NodeClient } from './client';
import type { NodeClientOptions, NodeOptions } from './types';

export function init(options: NodeOptions = {}): NodeClient {
  if (options.clientId === undefined && process.env.ALLIANCE_CLIENT_ID) {
    options.clientId = process.env.ALLIANCE_CLIENT_ID;
  }

  if (options.clientSecret === undefined && process.env.ALLIANCE_CLIENT_SECRET) {
    options.clientSecret = process.env.ALLIANCE_CLIENT_SECRET;
  }

  if (options.dsn === undefined && process.env.ALLIANCE_DSN) {
    options.dsn = process.env.ALLIANCE_DSN || 'https://events.earnalliance.com/v1/custom-events';
  }

  if (options.gameId === undefined && process.env.ALLIANCE_GAME_ID) {
    options.gameId = process.env.ALLIANCE_GAME_ID;
  }

  const { clientId, clientSecret, dsn, gameId } = options;

  if (!clientId || !clientSecret || !dsn || !gameId) {
    throw new Error('Missing required client options');
  }

  const clientOptions: NodeClientOptions = {
    clientId,
    clientSecret,
    dsn,
    gameId,
  };

  return new NodeClient(clientOptions);
}
