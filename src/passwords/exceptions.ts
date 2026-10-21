import { Exception } from "@mantlebee/ts-core";

/**
 * Codes of the exceptions thrown by {@link generateRandomPassword}.
 */
export const GenerateRandomPasswordExceptionCodes = {
  /** No requirement has `allowedChars`, so there are no chars to pick. */
  noAllowedChars: "NoAllowedChars",
  /** The requirements can't be satisfied within the maximum length (256). */
  unsatisfiableRequirements: "UnsatisfiableRequirements",
} as const;

/**
 * A code of the exceptions thrown by {@link generateRandomPassword}: one of the
 * values of {@link GenerateRandomPasswordExceptionCodes}.
 */
export type GenerateRandomPasswordExceptionCodes =
  (typeof GenerateRandomPasswordExceptionCodes)[keyof typeof GenerateRandomPasswordExceptionCodes];

/** Thrown by {@link generateRandomPassword} when no requirement has `allowedChars`. */
export class NoAllowedCharsException extends Exception {
  public constructor() {
    super(
      GenerateRandomPasswordExceptionCodes.noAllowedChars,
      "generateRandomPassword: no requirement has allowed chars",
    );
    this.name = "NoAllowedCharsException";
  }
}

/**
 * Thrown by {@link generateRandomPassword} when the requirements can't be satisfied
 * within the maximum length (256).
 */
export class UnsatisfiableRequirementsException extends Exception {
  public constructor() {
    super(
      GenerateRandomPasswordExceptionCodes.unsatisfiableRequirements,
      "generateRandomPassword: requirements cannot be satisfied",
    );
    this.name = "UnsatisfiableRequirementsException";
  }
}
