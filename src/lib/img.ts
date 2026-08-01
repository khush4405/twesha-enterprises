/**
 * Responsive image helpers.
 *
 * scripts/optimize_images.py emits two WebP variants for every product image:
 *   /products/<name>.webp      1200px - detail panel
 *   /products/<name>-sm.webp    500px - catalogue cards
 *
 * cardSrcSet() only returns a srcset for paths that follow that pattern, so a
 * file added later by hand (a .png dropped into public/) degrades safely to a
 * plain src with no broken candidate.
 */

const GENERATED = /^\/products\/[^/]+\.webp$/;

export function cardSrcSet(src?: string): string | undefined {
  if (!src || !GENERATED.test(src) || src.endsWith("-sm.webp")) return undefined;
  return `${src.replace(/\.webp$/, "-sm.webp")} 500w, ${src} 1200w`;
}

/** Card grid: full width on phones, two-up on tablets, ~380px on desktop. */
export const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px";
