import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers";
// Not from `@/strings`, which imports the pattern parser: it would be a cycle.
import { generateRandomStringFromChars } from "@/strings/generate-random-string-from-chars";

import { PatternRule } from "../pattern-rule";

type RepeatableCharacter = "0" | "A" | "a";

// Getters, not their results: calling them here would run code at module load,
// which bundlers treat as a side effect and never tree-shake.
const CharsMap: Record<RepeatableCharacter, () => string> = {
  "0": getNumberChars,
  A: getUppercaseChars,
  a: getLowercaseChars,
};

// Not `char in CharsMap`, which is true for `constructor` too.
const isRepeatableCharacter = (
  char: string | undefined,
): char is RepeatableCharacter => char === "0" || char === "A" || char === "a";

/**
 * Number of chars of a repeater, `X{n}` or `X{n,M}`: the regex of the rule
 * guarantees one or two numbers. `parseInt` ignores the closing bracket.
 */
const getRepeat = (match: string) => {
  const [min, max = min] = match
    .substring(2)
    .split(",")
    .map((a) => parseInt(a)) as [number, number?];
  return generateRandomNumber(max, min);
};

/**
 * Generates a random digit for `0`, uppercase letter for `A` and lowercase
 * letter for `a`; with a repeater, `X{n}` or `X{n,M}`, it generates n to M of them.
 */
export const matchRepeatableCharacter: PatternRule = (pattern, index) => {
  const char = pattern[index];
  if (!isRepeatableCharacter(char)) return null;
  const chars = CharsMap[char]();
  if (/^.\{\d+(,\d+)?\}/.test(pattern.substring(index))) {
    // The regex guarantees the closing bracket.
    const endIndex = pattern.indexOf("}", index);
    const repeat = getRepeat(pattern.substring(index, endIndex + 1));
    return {
      length: endIndex - index + 1,
      value: generateRandomStringFromChars(chars, repeat),
    };
  }
  return { length: 1, value: generateRandomStringFromChars(chars, 1) };
};
