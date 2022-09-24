/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Organization } from './Organization';
import type { Page } from './Page';

export type OrganizationsPage = (Page & {
  results: Array<Organization>;
});

