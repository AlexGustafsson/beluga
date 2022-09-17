/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Repository = {
  name: string;
  namespace: string;
  repository_type: Repository.repository_type | null;
  status: number;
  is_private: boolean;
  star_count: number;
  pull_count: number;
  last_updated: string;
  date_registered: string;
  affiliation: string | null;
  media_types: Array<string>;
};

export namespace Repository {

  export enum repository_type {
    IMAGE = 'image',
  }


}

