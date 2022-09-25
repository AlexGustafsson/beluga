/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Token = {
  uuid: string;
  client_id: string;
  creator_ip?: string;
  creator_ua: string;
  created_at: string;
  last_used: string | null;
  generated_by: string;
  is_active: boolean;
  token?: string;
  token_label: string;
  scopes: Array<string>;
};

