/**
 * Generates a random integer/float number between the given min and max values, max included.
 * To return an integer leave `decimals` to 0.
 * If `decimals` is greater than 0, the max value will be an integer anyway.
 * @example
 * Generates a random number between 0 and 10.
 * ```ts
 * generateRandomNumber(100)
 * // eg. 42
 * ```
 * @example
 * Generates a random number between 1 and 10.
 * ```ts
 * generateRandomNumber(10, 1)
 * // eg. 7
 * ```
 * @example
 * Generates a random number between 0 and 1.
 * ```ts
 * generateRandomNumber(0, 1, 2)
 * // eg. 0.42
 * ```
 * @param max Maximum number that can be generated.
 * @param min Minimum number that can be generated.
 * @param decimals Digits after the decimals point.
 * @returns a random number between min and max, max included.
 */
export function generateRandomNumber(
  max: number,
  min = 0,
  decimals = 0
): number {
  if (max === min) return max;
  const random = Math.random() * (max - min + 1) + min;
  if (decimals) {
    if (random >= max) return max;
    return parseFloat(random.toFixed(decimals));
  } else {
    return Math.floor(random);
  }
}
