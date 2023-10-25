import { BatchProcessor } from './processors/batch-processor';
import { HTTPTransporter } from './transporters/http';
import type { IdentifyingProperties, ITraits, NodeClientOptions } from './types';
/**
 * The Earn Alliance Node SDK Client.
 *
 * @see NodeClientOptions for documentation on configuration options.
 * @see AllianceClient for usage documentation.
 */
export declare class NodeClient {
    /** Options passed to the SDK. */
    protected readonly _options: NodeClientOptions;
    protected readonly _processor: BatchProcessor;
    protected readonly _transporter: HTTPTransporter;
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: NodeClientOptions);
    track(userId: string, eventName: string, valueOrTraits?: number | ITraits, traits?: ITraits): void;
    setUserIdentifiers(userId: string, identifyingProperties: IdentifyingProperties): void;
}
//# sourceMappingURL=client.d.ts.map