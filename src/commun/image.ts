import { sum } from './math';

export function makeArrayFromPixels(
  raw: Uint8ClampedArray,
  height,
  width,
  sumColor = false,
): number[][] {
  const pixels2D = new Array(height);

  for (let line = 0; line < height; line++) {
    pixels2D[line] = new Array(width);

    for (let col = 0; col < width; col++) {
      const index = col * 3 + line * width * 3;
      const rgb = [raw[index] + raw[index + 1] + raw[index + 2]];
      pixels2D[line][col] = sumColor ? sum(rgb) : rgb;
    }
  }

  return pixels2D;
}
