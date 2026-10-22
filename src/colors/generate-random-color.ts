import { Color, IColor } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers/generate-random-number";

/**
 * Random value of a channel between the two given ones, in any order: `from`
 * can be lighter than `to`.
 */
const getRandomChannel = (a: number, b: number) =>
  generateRandomNumber(Math.max(a, b), Math.min(a, b));

/**
 * Generates a random IColor instance.
 * @param transparent Generate a color with trasparency or not.
 * @param from Color reference for low values.
 * @param to Color reference for high values.
 * @returns a IColor instance.
 */
export function generateRandomColor(
  transparent = false,
  from: IColor = new Color(0, 0, 0),
  to: IColor = new Color(255, 255, 255),
): IColor {
  const red = getRandomChannel(from.red, to.red);
  const green = getRandomChannel(from.green, to.green);
  const blue = getRandomChannel(from.blue, to.blue);
  const alpha = transparent ? generateRandomNumber(1, 0, 2) : undefined;
  return new Color(red, green, blue, alpha);
}
