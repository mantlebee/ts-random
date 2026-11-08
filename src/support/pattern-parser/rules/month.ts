import { generateRandomNumber } from "@/numbers/generate-random-number";

import { PatternRule } from "../pattern-rule";

/**
 * Generates a two-digit month, from 01 to 12, for `mm`.
 */
export const matchMonth: PatternRule = (pattern, index, random) => {
  if (!pattern.startsWith("mm", index)) return null;
  const value = `${generateRandomNumber(12, 1, 0, { random })}`.padStart(
    2,
    "0",
  );
  return { length: 2, value };
};
