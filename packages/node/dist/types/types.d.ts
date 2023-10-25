import type { HTTPTransporter } from './transporters/http';
export interface NodeOptions {
    clientId?: string;
    clientSecret?: string;
    dsn?: string;
    gameId?: string;
}
export interface NodeClientOptions extends NodeOptions {
    clientId: string;
    clientSecret: string;
    dsn: string;
    gameId: string;
}
export interface HTTPTransporterOptions extends NodeClientOptions {
    maxRetryAttempts?: number;
}
export interface BatchProcessorOptions extends NodeClientOptions {
    batchSize?: number;
    gameId: string;
    interval?: number;
    maxQueueSize?: number;
    transporter: HTTPTransporter;
}
export declare enum EnumQueueItemType {
    Event = "event",
    Identifier = "identifier"
}
export type IQueueItem = {
    type: EnumQueueItemType.Event;
    event: IEvent;
} | {
    type: EnumQueueItemType.Identifier;
    identifier: IIdentifier;
};
export interface IEvent {
    userId: string;
    timestamp: string;
    event: string;
    traits?: ITraits;
    value?: number;
}
export declare enum EnumIdentifierPropNames {
    appleId = "appleId",
    discordId = "discordId",
    email = "email",
    epicGamesId = "epicGamesId",
    steamId = "steamId",
    twitterId = "twitterId",
    walletAddress = "walletAddress"
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
export interface ITraits extends Record<string, string | number | boolean | null> {
}
//# sourceMappingURL=types.d.ts.map