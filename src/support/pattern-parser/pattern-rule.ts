import { Nullable } from "@mantlebee/ts-core";

import { RandomFn } from "@/seed/random-fn";

/**
 * Chars of the pattern matched by a rule, and the value generated for them.
 */
export type PatternMatch = {
  /** Number of chars of the pattern matched, at least 1. */
  length: number;
  value: string;
};

/**
 * Matches the pattern at the given index, generating its value with `random`.
 * @returns the match and its generated value, `null` if the rule doesn't apply.
 */
export type PatternRule = (
  pattern: string,
  index: number,
  random: RandomFn,
) => Nullable<PatternMatch>;
