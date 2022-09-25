/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RepositoryPage } from '../models/RepositoryPage';
import type { User } from '../models/User';
import type { UserUpdate } from '../models/UserUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Fetch current user
   * Fetch current user
   * @returns User User
   * @throws ApiError
   */
  public getCurrentUser(): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/user',
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * Update current user
   * Update current user
   * @param requestBody User update
   * @returns User User
   * @throws ApiError
   */
  public updateCurrentUser(
    requestBody: UserUpdate,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/v2/user',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal server error`,
      },
    });
  }

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

  /**
   * Fetch user starred repositories
   * Fetch user starred repositories
   * @param user
   * @param pageSize Page size
   * @param page Page index
   * @param ordering Sort order
   * @returns RepositoryPage Repositories
   * @throws ApiError
   */
  public getUserStarred(
    user: string,
    pageSize?: number,
    page?: number,
    ordering: 'last_updated' | '-last_updated' | 'name' | '-name' = 'last_updated',
  ): CancelablePromise<RepositoryPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/users/{user}/repositories/starred',
      path: {
        'user': user,
      },
      query: {
        'page_size': pageSize,
        'page': page,
        'ordering': ordering,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * Fetch user contributed repositories
   * Fetch user contributed repositories
   * @param user
   * @param pageSize Page size
   * @param page Page index
   * @param ordering Sort order
   * @returns RepositoryPage Repositories
   * @throws ApiError
   */
  public getUserContributed(
    user: string,
    pageSize?: number,
    page?: number,
    ordering: 'last_updated' | '-last_updated' | 'name' | '-name' = 'last_updated',
  ): CancelablePromise<RepositoryPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/users/{user}/repositories/contributed',
      path: {
        'user': user,
      },
      query: {
        'page_size': pageSize,
        'page': page,
        'ordering': ordering,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
