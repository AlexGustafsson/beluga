/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BuildSettings } from './BuildSettings';

export type CreateRepositoryRequest = {
  namespace?: string;
  registry?: string;
  image?: string;
  name?: string;
  description?: string;
  privacy?: CreateRepositoryRequest.privacy;
  provider?: string | null;
  build_settings?: Array<BuildSettings>;
  is_private?: boolean;
};

export namespace CreateRepositoryRequest {

  export enum privacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
  }


}

