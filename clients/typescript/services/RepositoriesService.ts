/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRepositoryRequest } from '../models/CreateRepositoryRequest';
import type { ImageWithDetails } from '../models/ImageWithDetails';
import type { Repository } from '../models/Repository';
import type { RepositoryPage } from '../models/RepositoryPage';
import type { RepositoryWithDetails } from '../models/RepositoryWithDetails';
import type { Tag } from '../models/Tag';
import type { TagPage } from '../models/TagPage';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RepositoriesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create a repository
   * Create a repository
   * @param requestBody Repository to create
   * @returns Repository Created
   * @throws ApiError
   */
  public postRepositories(
    requestBody: CreateRepositoryRequest,
  ): CancelablePromise<Repository> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v2/repositories',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * List repositories in a namespace
   * List repositories in a namespace
   * @param namespace User or organization
   * @param pageSize Page size
   * @param page Page index
   * @param ordering Sort order
   * @returns RepositoryPage Repositories
   * @throws ApiError
   */
  public getRepositories(
    namespace: string,
    pageSize?: number,
    page?: number,
    ordering: 'last_updated' | '-last_updated' | 'name' | '-name' = 'last_updated',
  ): CancelablePromise<RepositoryPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}',
      path: {
        'namespace': namespace,
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
   * @param ordering Sort order
   * @param name Prefix of label names to match against
   * @returns TagPage Repositories
   * @throws ApiError
   */
  public getTags(
    namespace: string,
    repository: string,
    ordering: 'last_updated' | '-last_updated' | 'name' | '-name' = 'last_updated',
    name?: string,
  ): CancelablePromise<TagPage> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}/tags',
      path: {
        'namespace': namespace,
        'repository': repository,
      },
      query: {
        'ordering': ordering,
        'name': name,
      },
      errors: {
        500: `Internal server error`,
      },
    });
  }

  /**
   * Get a tag
   * Get a tag
   * @param namespace User or organization
   * @param repository Name of the repository
   * @param tag Name of the tag
   * @returns Tag Tag
   * @throws ApiError
   */
  public getTag(
    namespace: string,
    repository: string,
    tag: string,
  ): CancelablePromise<Tag> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v2/repositories/{namespace}/{repository}/tags/{tag}',
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
