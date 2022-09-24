/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { OrganizationsPage } from '../models/OrganizationsPage';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrganizationsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Fetch organizations
   * Fetch organizations
   * @param pageSize Page size
   * @param page Page index
   * @param ordering Sort order
   * @returns OrganizationsPage Organizations
   * @throws ApiError
   */
  public getOrganizations(
    pageSize?: number,
    page?: number,
    ordering: 'last_updated' | '-last_updated' | 'name' | '-name' = 'last_updated',
  ): CancelablePromise<OrganizationsPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/orgs',
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
   * Fetch organization
   * Fetch organization
   * @param organization
   * @returns Organization Organization
   * @throws ApiError
   */
  public getOrganization(
    organization: string,
  ): CancelablePromise<Organization> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/orgs/{organization}',
      path: {
        'organization': organization,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
