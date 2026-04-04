/**
 * Deterministic pseudo-random number generator using integer-only math.
 * Produces identical results on server (Node.js) and client (browser),
 * unlike Math.sin()-based approaches which have floating-point precision
 * differences across engines.
 *
 * @param i - The index (e.g., particle index)
 * @param seed - A seed to differentiate different properties
 * @returns A deterministic value between 0 and 1
 */
export function drand(i: number, seed: number): number {
  let h = ((i * 2654435761) + (seed * 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1597334677);
  h = Math.imul(h ^ (h >>> 16), 2869860233);
  h = (h ^ (h >>> 15)) >>> 0;
  return h / 4294967296;
}
