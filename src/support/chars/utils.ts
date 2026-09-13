import { generateRandomNumber } from "@/numbers";

/**
 * Generates a random string from the given chars and of the given length.
 * @example
 * Generates a random string of 5 chars chosen between X and Y.
 * ```ts
 * generateRandomStringFromChars("XY", 5)
 * // eg. XXYXY
 * ```
 * @param chars List of chars from which to generate the string.
 * @param length Length of the string to generate.
 * @returns a random string from the given chars and of the given length.
 */
export function generateRandomStringFromChars(
  chars: string,
  length: number,
): string {
  return Array.from({ length }, () =>
    chars.charAt(generateRandomNumber(chars.length - 1)),
  ).join("");
}
