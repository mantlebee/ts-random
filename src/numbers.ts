/**
 * Generates a random integer/float number between the given min and max values, both included.
 * To return an integer leave `decimals` to 0.
 * Every number with `decimals` digits after the decimal point, between min and
 * max, has the same chance to be generated.
 * @example
 * Generates a random number between 0 and 100.
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
 * Generates a random number between 0 and 1, with 2 decimals.
 * ```ts
 * generateRandomNumber(1, 0, 2)
 * // eg. 0.42
 * ```
 * @param max Maximum number that can be generated.
 * @param min Minimum number that can be generated.
 * @param decimals Digits after the decimals point.
 * @returns a random number between min and max, both included.
 * @throws RangeError if `min` is greater than `max`, if `decimals` is not a
 * non-negative integer, or if no number with `decimals` digits is between min and max.
 */
export function generateRandomNumber(
  max: number,
  min = 0,
  decimals = 0,
): number {
  if (!Number.isInteger(decimals) || decimals < 0)
    throw new RangeError(`generateRandomNumber: invalid decimals ${decimals}`);
  if (!(min <= max))
    throw new RangeError(
      `generateRandomNumber: min ${min} is greater than max ${max}`,
    );
  // The range is scaled to integers, e.g. [10, 12] with 2 decimals becomes
  // [1000, 1200], so the max is as likely as any other value.
  // `toPrecision` removes floating point noise, e.g. 1.1 * 100 = 110.00000000000001.
  const factor = 10 ** decimals;
  const scaledMin = Math.ceil(+(min * factor).toPrecision(12));
  const scaledMax = Math.floor(+(max * factor).toPrecision(12));
  if (scaledMin > scaledMax)
    throw new RangeError(
      `generateRandomNumber: no number with ${decimals} decimals between ${min} and ${max}`,
    );
  const random =
    scaledMin + Math.floor(Math.random() * (scaledMax - scaledMin + 1));
  return random / factor;
}
