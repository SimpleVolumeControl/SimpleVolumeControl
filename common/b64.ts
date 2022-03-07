/**
 * The alphabet that is used for all base64 operations.
 */
export const B64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Encodes a single number value as its corresponding base64 character.
 * @param value The value to be encoded. Must be in the range of 0 to 63.
 * @return A single character of the base64 alphabet or an empty string if invalid value was provided.
 */
export function b64Encode(value: number): string {
  return B64_ALPHABET.charAt(value);
}

/**
 * Decodes a single base64 character.
 * @param value The base64 character to be decoded.
 * @return A number between 0 and 63 or -1 if an invalid input was provided.
 */
export function b64Decode(value: string): number {
  return value === '' ? -1 : B64_ALPHABET.indexOf(value);
}
