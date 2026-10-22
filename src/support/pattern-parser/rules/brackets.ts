import { PatternRule } from "../pattern-rule";

/**
 * Copies the chars inside the brackets as they are, placeholders included.
 */
export const matchBrackets: PatternRule = (pattern, index) => {
  if (pattern[index] !== "(") return null;
  const endIndex = pattern.indexOf(")", index);
  if (endIndex === -1)
    throw new SyntaxError(
      `generateRandomStringFromPattern: closing bracket not found for the one at index ${index}`,
    );
  return {
    length: endIndex - index + 1,
    value: pattern.substring(index + 1, endIndex),
  };
};
