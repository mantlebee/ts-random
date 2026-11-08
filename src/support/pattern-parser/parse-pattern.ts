import { List } from "@mantlebee/ts-core";

import { RandomFn } from "@/seed/random-fn";

import { PatternMatch, PatternRule } from "./pattern-rule";
import { matchBrackets } from "./rules/brackets";
import { matchLiteralChar } from "./rules/literal-char";
import { matchMonth } from "./rules/month";
import { matchRepeatableCharacter } from "./rules/repeatable-character";

/**
 * Rules tried, in order, at every index of the pattern.
 */
const Rules: List<PatternRule> = [
  matchBrackets,
  matchMonth,
  matchRepeatableCharacter,
];

/**
 * The first rule that matches at the given index. The chars that no rule
 * matches are copied as they are.
 */
const match = (
  pattern: string,
  index: number,
  random: RandomFn,
): PatternMatch => {
  for (const rule of Rules) {
    const ruleMatch = rule(pattern, index, random);
    if (ruleMatch) return ruleMatch;
  }
  return matchLiteralChar(pattern, index);
};

/**
 * Generates a random string from the given pattern: see
 * `generateRandomStringFromPattern` for its syntax. Every random value is
 * generated with `random`.
 */
export function parsePattern(pattern: string, random: RandomFn): string {
  let result = "";
  for (let index = 0; index < pattern.length;) {
    const { length, value } = match(pattern, index, random);
    result += value;
    index += length;
  }
  return result;
}
