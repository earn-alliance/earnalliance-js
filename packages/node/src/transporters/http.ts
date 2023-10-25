import crypto from 'crypto';

import type { HTTPTransporterOptions } from '../types';

export class HTTPTransporter {
  private _options: HTTPTransporterOptions;

  private _maxRetryAttempts: number;

  public constructor(options: HTTPTransporterOptions) {
    this._options = options;
    this._maxRetryAttempts = options.maxRetryAttempts || 5;
  }

  public async send(payload: Record<string, unknown>, attempt: number = 0): Promise<boolean> {
    try {
      const { clientId } = this._options;
      const timestamp = Date.now();
      const signature = this._sign(payload, timestamp);

      const headers = { 'x-client-id': clientId, 'x-timestamp': `${timestamp}`, 'x-signature': signature };

      await fetch(this._options.dsn, { method: 'POST', headers });

      return true;
    } catch (err) {
      if (attempt < this._maxRetryAttempts) {
        return this._retry(payload, attempt + 1);
      }
      return false;
    }
  }

  private _sign(payload: Record<string, unknown>, timestamp: number): string {
    const { clientId, clientSecret } = this._options;

    const body = JSON.stringify(payload);

    const message = `${clientId}${timestamp}${body}`;
    return crypto.createHmac('sha256', clientSecret).update(message).digest('hex');
  }

  private _retry(payload: Record<string, unknown>, attempt: number): Promise<boolean> {
    const nextAttemptIn = Math.pow(2, attempt) * 1_000;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.send(payload, attempt).then(resolve).catch(reject);
      }, nextAttemptIn);
    });
  }
}
