/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateRepositoryRequest = {
  namespace: string;
  registry: string;
  image: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  is_private: boolean;
};

