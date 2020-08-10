/**
 * Sets aren't serializable in redux. gotta make our own.
 */
export interface ReduxSet {
  [key: string]: true;
}
