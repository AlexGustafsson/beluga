/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Page } from './Page';
import type { Repository } from './Repository';

export type RepositoryPage = (Page & {
  results: Array<Repository>;
});

