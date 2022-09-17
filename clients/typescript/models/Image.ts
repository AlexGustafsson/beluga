/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Image = {
  architecture: string;
  features: string | null;
  variant: string | null;
  digest: string;
  os: string;
  os_features: string;
  os_version: string | null;
  size: number;
  status: string;
  last_pulled: string;
  last_pushed: string;
};

