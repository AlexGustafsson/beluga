/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Page = {
  /**
   * Total results
   */
  count: number;
  /**
   * URL to the next page
   */
  next: string | null;
  /**
   * URL to the previous page
   */
  previous: string | null;
  /**
   * Current page
   */
  page: number;
};

