import type { NodeClientOptions } from '../types';

export class HTTPTransporter {
  private _options: NodeClientOptions;

  public constructor(options: NodeClientOptions) {
    this._options = options;
  }
}
