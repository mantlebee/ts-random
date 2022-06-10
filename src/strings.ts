/**
 * Generates a random string from the given chars and of the given length.
 * @param chars List of chars from which to generate the string.
 * @param length Length of the string to generate.
 * @returns a random string.
 */
export function generateRandomString(chars: string, length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}
