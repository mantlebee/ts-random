import { Color, IColor } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers/generate-random-number";
import { RandomFn, RandomOptions } from "@/seed/random-fn";

/**
 * Random value of a channel between the two given ones, in any order: `from`
 * can be lighter than `to`.
 */
const getRandomChannel = (a: number, b: number, random: RandomFn) =>
  generateRandomNumber(Math.max(a, b), Math.min(a, b), 0, { random });

/**
 * Generates a random IColor instance.
 * @param transparent Generate a color with trasparency or not.
 * @param from Color reference for low values.
 * @param to Color reference for high values.
 * @param options `random`, the generator to use instead of `Math.random`.
 * @returns a IColor instance.
 */
export function generateRandomColor(
  transparent = false,
  from: IColor = new Color(0, 0, 0),
  to: IColor = new Color(255, 255, 255),
  options: RandomOptions = {},
): IColor {
  const random = options.random ?? Math.random;
  const red = getRandomChannel(from.red, to.red, random);
  const green = getRandomChannel(from.green, to.green, random);
  const blue = getRandomChannel(from.blue, to.blue, random);
  const alpha = transparent
    ? generateRandomNumber(1, 0, 2, { random })
    : undefined;
  return new Color(red, green, blue, alpha);
}
