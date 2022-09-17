/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Image } from './Image';

export type Tag = {
  creator: number;
  id: number;
  last_updated: string;
  last_updater: number;
  last_updated_username: string;
  name: string;
  repository: number;
  full_size: number;
  v2: boolean;
  tag_status: string;
  tag_last_pulled: string;
  tag_last_pushed: string;
  media_type: string;
  digest: string;
  images: Array<Image>;
};

