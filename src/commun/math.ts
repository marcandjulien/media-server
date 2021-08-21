/**
 * Average the array
 * @param arr
 * @returns
 */
export function average(arr) {
  return sum(arr) / arr.length;
}

/**
 * Sum the number in the array
 * @param arr
 * @returns
 */
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
