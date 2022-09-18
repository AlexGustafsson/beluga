/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Repository = {
  name: string;
  namespace: string;
  repository_type: 'image' | null;
  status: number;
  is_private: boolean;
  star_count: number;
  pull_count: number;
  last_updated: string;
  date_registered: string;
  affiliation: string | null;
  media_types: Array<string>;
};

