import { identify } from './identify';
import { BatchProcessor } from './processors/batch-processor';
import { track } from './track';
import { HTTPTransporter } from './transporters/http';
import type { IdentifyingProperties, ITraits, NodeClientOptions } from './types';

/**
 * The Earn Alliance Node SDK Client.
 *
 * @see NodeClientOptions for documentation on configuration options.
 * @see AllianceClient for usage documentation.
 */
export class NodeClient {
  /** Options passed to the SDK. */
  protected readonly _options: NodeClientOptions;

  protected readonly _processor: BatchProcessor;

  protected readonly _transporter: HTTPTransporter;

  /**
   * Creates a new Node SDK instance.
   * @param options Configuration options for this SDK.
   */
  public constructor(options: NodeClientOptions) {
    this._options = options;
    this._transporter = new HTTPTransporter(options);
    this._processor = new BatchProcessor({ ...options, transporter: this._transporter });
  }

  public track(userId: string, eventName: string, valueOrTraits?: number | ITraits, traits?: ITraits): void {
    const event = track(userId, eventName, valueOrTraits, traits);
    void this._processor.addEvent(event);
  }

  public setUserIdentifiers(userId: string, identifyingProperties: IdentifyingProperties): void {
    const identifier = identify(userId, identifyingProperties);
    void this._processor.addIdentifier(identifier);
  }
}
