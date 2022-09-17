/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Image } from './Image';
import type { Layer } from './Layer';

export type ImageWithDetails = (Image & {
  layers: Array<Layer>;
});

