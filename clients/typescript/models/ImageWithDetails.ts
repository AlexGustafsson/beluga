/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Image } from './Image';

export type ImageWithDetails = (Image & {
  layers: Array<{
    digest?: string;
    size: number;
    instruction: string;
  }>;
});

