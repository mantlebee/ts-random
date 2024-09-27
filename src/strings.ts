import { PatternParser } from "@/support";

import { generateRandomNumber } from "./numbers";

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
  length: number
): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = generateRandomNumber(chars.length - 1);
    str += chars.charAt(randomIndex);
  }
  return str;
}

/**
 * Generates a random string from the given pattern. The length of the string depends on pattern itself.
 * Patterns allow to generate strings like telephone numbers, credit card numbers, banking IBAN, ecc.
 * Patterns are defined by special chars, escape brackets and repeater brackets:
 *    Special Chars:
 *      - A     : random uppercase letter
 *      - a     : random lowercase letter
 *      - 0     : random integer number
 *    Custom Chars:
 *      - mm    : two-digit month (01 for January)
 *    Escape brackets:
 *      - ()    : chars inside are not considered special chars
 *    Repeater brackets:
 *      - {n}   : repeats previous special char n-1 times
 *      - {n,M} : repeats previous special char between n and M times minus one
 * @example
 * Generates a random telephone number.
 * ```ts
 * generateRandomStringFromPattern("+000-00000") // or "+0{3}-0{5}"
 * // eg. +333-41187
 * ```
 * @example
 * Generates a random credit card number.
 * ```ts
 * generateRandomStringFromPattern("0000-0000-0000-0000") // or "0{4}-0{4}-0{4}-0{4}"
 * // eg. 3244-6512-9983-2379
 * ```
 * @example
 * Generates a random italian IBAN compliant string.
 * ```ts
 * generateRandomStringFromPattern("(IT)00A0{22}")
 * // eg. IT60X0542811101000000123456
 * ```
 * @example
 * Generates a random lowercase string with first letter uppercase and length variable between 8 and 12 chars.
 * ```ts
 * generateRandomStringFromPattern("Aa{8,12}")
 * // eg. Rdnaetdaw
 * ```
 * @param pattern Pattern for the random string.
 * @returns a random string from the given pattern.
 */
export function generateRandomStringFromPattern(pattern: string): string {
  return new PatternParser().parse(pattern);
}
