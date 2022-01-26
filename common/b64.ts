export const B64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function b64Encode(value: number): string {
  return B64_ALPHABET.charAt(value);
}

export function b64Decode(value: string): number {
  return value === '' ? -1 : B64_ALPHABET.indexOf(value);
}
