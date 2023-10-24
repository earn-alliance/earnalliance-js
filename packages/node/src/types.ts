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

export interface BatchProcessorOptions {
  batchSize?: number;
  interval?: number;
  maxQueueSize?: number;
  transporter: HTTPTransporter;
}

export interface IEvent {
  userId: string;
  timestamp: string;
  event: string;
  traits?: ITraits;
  value?: number;
}

export interface ITraits extends Record<string, string | number | boolean | null> {}
