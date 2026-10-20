import { generateRandomStringFromChars, PatternParser } from "@/support";

export { generateRandomStringFromChars };

/**
 * Generates a random string from the given pattern. The length of the string depends on pattern itself.
 * Patterns allow to generate strings like telephone numbers, credit card numbers, banking IBAN, ecc.
 * Patterns are defined by placeholders, escape brackets and repeater brackets.
 * Any other char is copied as it is.
 *    Placeholders:
 *      - A     : random uppercase letter
 *      - a     : random lowercase letter
 *      - 0     : random digit
 *      - mm    : two-digit month, from 01 (January) to 12 (December)
 *    Escape brackets:
 *      - ()    : chars inside are copied as they are, placeholders included
 *    Repeater brackets, after `A`, `a` or `0`:
 *      - {n}   : the placeholder generates n chars
 *      - {n,M} : the placeholder generates between n and M chars, both included
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
 * Generates a random string with first letter uppercase, followed by 8 to 12
 * lowercase letters (9 to 13 chars in total).
 * ```ts
 * generateRandomStringFromPattern("Aa{8,12}")
 * // eg. Rdnaetdaw
 * ```
 * @param pattern Pattern for the random string.
 * @returns a random string from the given pattern.
 * @throws SyntaxError if an escape bracket is not closed.
 * @throws RangeError if the min of a repeater is greater than its max, e.g. `a{12,8}`.
 */
export function generateRandomStringFromPattern(pattern: string): string {
  return new PatternParser().parse(pattern);
}
