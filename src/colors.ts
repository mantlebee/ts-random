import { Color, IColor } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers";

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
  to: IColor = new Color(255, 255, 255)
): IColor {
  const red = generateRandomNumber(from.red, to.red);
  const green = generateRandomNumber(from.green, to.green);
  const blue = generateRandomNumber(from.blue, to.blue);
  const alpha = transparent ? generateRandomNumber(1) : undefined;
  return new Color(red, green, blue, alpha);
}
