/**
 * Pads a number with a leading zero if it is less than 10.
 *
 * @param num - The number to be padded.
 * @returns A string representation of the number,
 *          with a leading zero if the number is less than 10.
 */
export function padNumber(num: number): string {
  return num < 10 ? "0" + num : num.toString();
}
