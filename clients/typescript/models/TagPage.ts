/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Page } from './Page';
import type { Tag } from './Tag';

export type TagPage = (Page & {
  results: Array<Tag>;
});

