/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Label } from './Label';
import type { Logo } from './Logo';
import type { Publisher } from './Publisher';

export type Summary = {
  id: string;
  name: string;
  slug: string;
  type: 'image';
  publisher: Publisher;
  created_at: string;
  updated_at: string;
  short_description: string;
  source: string;
  popularity: number;
  categories: Array<Label>;
  operating_systems: Array<Label>;
  architectures: Array<Label>;
  logo_url: Logo;
  certification_status: string;
  star_count: number;
  pull_count: number;
  filter_type: string;
};

