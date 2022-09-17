/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SummaryPage } from '../models/SummaryPage';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SearchService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Perform a search
   * Perform search
   * @param pageSize Page size
   * @param type Type of responses
   * @param operatingSystem Comma separated operating systems
   * @param architecture Comma separated image architectures
   * @param q Free text query
   * @param source Product source
   * @param page Page integer
   * @param sort Sort option, such as updated_at and suggested
   * @returns SummaryPage Search results
   * @throws ApiError
   */
  public getSearch(
    pageSize?: number,
    type?: string,
    operatingSystem?: string,
    architecture?: string,
    q?: string,
    source?: string,
    page?: number,
    sort?: string,
  ): CancelablePromise<SummaryPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/content/v1/products/search',
      query: {
        'page_size': pageSize,
        'type': type,
        'operating_system': operatingSystem,
        'architecture': architecture,
        'q': q,
        'source': source,
        'page': page,
        'sort': sort,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
