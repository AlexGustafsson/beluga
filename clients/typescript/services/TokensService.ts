/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Token } from '../models/Token';
import type { TokenPage } from '../models/TokenPage';
import type { TokenRequest } from '../models/TokenRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TokensService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create an access token
   * Create an access token
   * @param requestBody Token request
   * @returns Token Token
   * @throws ApiError
   */
  public createAccessToken(
    requestBody: TokenRequest,
  ): CancelablePromise<Token> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v2/access-tokens',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * Get access tokens
   * Get access tokens
   * @returns TokenPage Token
   * @throws ApiError
   */
  public getAccessTokens(): CancelablePromise<TokenPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/access-tokens',
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
