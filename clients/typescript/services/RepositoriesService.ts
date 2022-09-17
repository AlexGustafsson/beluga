/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageWithDetails } from '../models/ImageWithDetails';
import type { RepositoryPage } from '../models/RepositoryPage';
import type { RepositoryWithDetails } from '../models/RepositoryWithDetails';
import type { TagPage } from '../models/TagPage';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RepositoriesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * List repositories in a namespace
   * List repositories in a namespace
   * @param namespace User or organization
   * @returns RepositoryPage Repositories
   * @throws ApiError
   */
  public getRepositories(
    namespace: string,
  ): CancelablePromise<RepositoryPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}',
      path: {
        'namespace': namespace,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * List repositories in a namespace
   * List repositories in a namespace
   * @param namespace User or organization
   * @param repository Name of the repository
   * @returns RepositoryWithDetails Repositories
   * @throws ApiError
   */
  public getRepository(
    namespace: string,
    repository: string,
  ): CancelablePromise<RepositoryWithDetails> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}',
      path: {
        'namespace': namespace,
        'repository': repository,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * List repositories in a namespace
   * List repositories in a namespace
   * @param namespace User or organization
   * @param repository Name of the repository
   * @returns TagPage Repositories
   * @throws ApiError
   */
  public getTags(
    namespace: string,
    repository: string,
  ): CancelablePromise<TagPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}/tags',
      path: {
        'namespace': namespace,
        'repository': repository,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * List images in tag
   * List images in tag
   * @param namespace User or organization
   * @param repository Name of the repository
   * @param tag Tag name
   * @returns ImageWithDetails Images
   * @throws ApiError
   */
  public getImages(
    namespace: string,
    repository: string,
    tag: string,
  ): CancelablePromise<Array<ImageWithDetails>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}/tags/{tag}/images',
      path: {
        'namespace': namespace,
        'repository': repository,
        'tag': tag,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * Fetch dockerfile
   * Fetch dockerfile
   * @param namespace User or organization
   * @param repository Name of the repository
   * @returns any Dockerfile
   * @throws ApiError
   */
  public getDockerfile(
    namespace: string,
    repository: string,
  ): CancelablePromise<{
    contents?: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}/dockerfile',
      path: {
        'namespace': namespace,
        'repository': repository,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

}
