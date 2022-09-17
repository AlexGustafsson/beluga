/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrganizationsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

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
