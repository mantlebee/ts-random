import {
  IPasswordRequirement,
  List,
  PasswordRequirementsDefault,
  validatePassword,
} from "@mantlebee/ts-core";

import { extractSecureRandomItem } from "@/secure/extract-secure-random-item";
import { shuffleSecureRandomItems } from "@/secure/shuffle-secure-random-items";

import {
  NoAllowedCharsException,
  UnsatisfiableRequirementsException,
} from "./exceptions";

/**
 * Hard limit of the generated passwords: requirements that are still not
 * satisfied at this length are considered unsatisfiable. It avoids infinite
 * loops when the requirements have no maximum length.
 */
const GenerateRandomPasswordMaxLength = 256;

/**
 * Generates a random password that satisfies the given requirements, using a
 * cryptographically secure random generator only.
 *
 * The password gets one char for each requirement that has `allowedChars`,
 * then it is filled with chars picked uniformly from the distinct union of
 * every `allowedChars`, until it is valid according to `validatePassword`.
 * The length is defined by the requirements only, e.g. by
 * `PasswordRequirementLength`. Finally the chars are shuffled, so the
 * position of each category is not predictable.
 *
 * The requirements are expected not to depend on the order of the chars, as
 * the ones of `@mantlebee/ts-core`.
 * @example
 * Generates a password with the default requirements (8-30 chars, lowercase,
 * uppercase, number, symbol, no whitespaces).
 * ```ts
 * generateRandomPassword()
 * // eg. "q7}Rk;bN"
 * ```
 * @example
 * Generates a 12 chars password made of lowercase letters and the symbols `-` and `_`.
 * ```ts
 * generateRandomPassword([
 *   new PasswordRequirementLength(12, 12),
 *   new PasswordRequirementIncludesLowercaseLetter(),
 *   new PasswordRequirementIncludesSymbol("-_"),
 * ])
 * // eg. "kd-qe_wnz-ab"
 * ```
 * @param requirements Requirements of the password, default `PasswordRequirementsDefault()`.
 * @returns a random password that satisfies the requirements.
 * @throws {@link NoAllowedCharsException} if no requirement has `allowedChars`.
 * @throws {@link UnsatisfiableRequirementsException} if the requirements can't be satisfied within 256
 * chars, e.g. when a `minLength` is greater than a `maxLength`, or with
 * `PasswordRequirementMatchPassword`.
 */
export function generateRandomPassword(
  requirements: List<IPasswordRequirement> = PasswordRequirementsDefault(),
): string {
  const allowedChars = requirements
    .map((a) => a.allowedChars)
    .filter((a): a is string => Boolean(a));
  if (!allowedChars.length) throw new NoAllowedCharsException();
  // `Array.from` splits by code point, so chars outside the BMP (e.g. emojis)
  // are kept whole. Filling chars are deduplicated, so each one has the same
  // chance to be picked, whatever requirement it comes from.
  const fillingChars = Array.from(new Set(Array.from(allowedChars.join(""))));
  const chars = allowedChars.map((a) => extractSecureRandomItem(Array.from(a)));
  while (!validatePassword(chars.join(""), requirements).isValid) {
    if (chars.length >= GenerateRandomPasswordMaxLength)
      throw new UnsatisfiableRequirementsException();
    chars.push(extractSecureRandomItem(fillingChars));
  }
  return shuffleSecureRandomItems(chars).join("");
}
