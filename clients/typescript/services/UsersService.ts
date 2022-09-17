/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Fetch user
   * Fetch user
   * @param user
   * @returns User User
   * @throws ApiError
   */
  public getUser(
    user: string,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/users/{user}',
      path: {
        'user': user,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
