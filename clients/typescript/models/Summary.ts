/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Summary = {
  id: string;
  name: string;
  slug: string;
  type: Summary.type;
  publisher: {
    id?: string;
    name?: string;
  };
  created_at: string;
  updated_at: string;
  short_description: string;
  source: string;
  popularity: number;
  categories: Array<{
    name: string;
    label: string;
  }>;
  operating_systems: Array<{
    name: string;
    label: string;
  }>;
  architectures: Array<{
    name: string;
    label: string;
  }>;
  logo_url: {
    small: string;
    'small@2x': string;
  };
  certification_status: string;
  star_count: number;
  filter_type: string;
};

export namespace Summary {

  export enum type {
    IMAGE = 'image',
  }


}

