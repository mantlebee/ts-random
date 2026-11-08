/**
 * Random generator with the same contract as `Math.random`: each call returns
 * a number in [0, 1).
 */
export type RandomFn = () => number;

/**
 * Options of the functions that accept a random generator.
 */
export type RandomOptions = {
  /**
   * Generator used instead of `Math.random`, e.g. one returned by
   * `createSeededRandom` to generate the same values at every run.
   * Default is `Math.random`.
   */
  random?: RandomFn;
};
