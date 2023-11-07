export interface NodeOptions {
  batchSize?: number;
  clientId?: string;
  clientSecret?: string;
  dsn?: string;
  flushEvents?: string[];
  gameId?: string;
  interval?: number;
  maxRetryAttempts?: number;
}

export type NodeClientOptions = Required<NodeOptions>;

export enum EnumQueueItemType {
  Event = 'event',
  Identifier = 'identifier',
}

export type IQueueItem =
  | { type: EnumQueueItemType.Event; event: IEvent }
  | { type: EnumQueueItemType.Identifier; identifier: IIdentifier };

export interface IEvent {
  userId: string;
  time: string;
  event: string;
  groupId?: string;
  traits?: ITraits;
  value?: number;
}

export enum EnumIdentifierPropNames {
  appleId = 'appleId',
  discordId = 'discordId',
  email = 'email',
  epicGamesId = 'epicGamesId',
  steamId = 'steamId',
  twitterId = 'twitterId',
  walletAddress = 'walletAddress',
}
export interface IdentifyingProperties {
  appleId?: string;
  discordId?: string;
  email?: string;
  epicGamesId?: string;
  steamId?: string;
  twitterId?: string;
  walletAddress?: string;
}

export interface IIdentifier {
  userId: string;
  appleId?: string | null;
  discordId?: string | null;
  email?: string | null;
  epicGamesId?: string | null;
  steamId?: string | null;
  twitterId?: string | null;
  walletAddress?: string | null;
}

export interface ITraits extends Record<string, string | number | boolean | null> {}
