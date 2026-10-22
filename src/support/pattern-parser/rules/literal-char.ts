import { PatternMatch } from "../pattern-rule";

/**
 * Copies the current char as it is. It applies to the chars that no rule
 * matches, so it always matches.
 */
export const matchLiteralChar = (
  pattern: string,
  index: number,
): PatternMatch => ({ length: 1, value: pattern.charAt(index) });
