import { generateRandomNumber } from "@/numbers/generate-random-number";

/**
 * Generates a random string from the given chars and of the given length.
 * @example
 * Generates a random string of 5 chars chosen between X and Y.
 * ```ts
 * generateRandomStringFromChars("XY", 5)
 * // eg. XXYXY
 * ```
 * Chars outside the BMP, such as emojis, are kept whole: `length` counts
 * them as one char, even if their JavaScript `length` is 2.
 * @param chars List of chars from which to generate the string.
 * @param length Number of chars of the string to generate.
 * @returns a random string from the given chars and of the given length.
 */
export function generateRandomStringFromChars(
  chars: string,
  length: number,
): string {
  // `Array.from` splits by code point, `charAt` would split emojis in halves.
  const charsList = Array.from(chars);
  if (!charsList.length) return "";
  return Array.from(
    { length },
    () => charsList[generateRandomNumber(charsList.length - 1)],
  ).join("");
}
