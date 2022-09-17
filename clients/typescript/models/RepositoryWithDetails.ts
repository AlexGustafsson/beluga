/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Repository } from './Repository';

export type RepositoryWithDetails = (Repository & {
  user: string;
  description: string;
  is_automated: boolean;
  can_edit: boolean;
  collaborator_count: number;
  hub_user: string;
  has_starred: boolean;
  full_description: string;
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
});

