/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Page } from './Page';
import type { Summary } from './Summary';

export type SummaryPage = (Page & {
  summaries: Array<Summary>;
});

