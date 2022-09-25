/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Page } from './Page';
import type { Token } from './Token';

export type TokenPage = (Page & {
  active_count: number;
  results: Array<Token>;
});

