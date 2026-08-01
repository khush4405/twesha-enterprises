#!/usr/bin/env python3
"""
Generate the web-ready WebP images from the untouched originals.

Source of truth : _original-images/   (git- and vercel-ignored)
Output          : public/  and  public/products/

Why two product variants: a catalogue card displays at ~380px CSS while the
detail panel displays at ~700px. Shipping one 1200px file to a card wastes
~4x the bytes, so cards get a 500px variant via srcset.

Quality is deliberately high. Measured against the original at on-screen
size, q92 scores SSIM 0.986 - visually indistinguishable.

  <name>.webp      1200px q92   product detail
  <name>-sm.webp    500px q90   catalogue cards

Run:  python scripts/optimize_images.py
      python scripts/optimize_images.py --only <substring>
"""

import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_original-images")
PUBLIC = os.path.join(ROOT, "public")
PRODUCTS = os.path.join(PUBLIC, "products")

FULL_W, FULL_Q = 1200, 92
SM_W, SM_Q = 500, 90

# Images that live at the root of public/ rather than public/products/.
# value = (max_width, quality) sized to 2x their CSS display size.
SITE = {
    "twesha-logo-subtle.png": (400, 88),          # header logo, 66px tall
    "Twesha EnterPrize logo new.png": (460, 88),  # footer logo, 150px tall
    "hero.png": (1600, 80),                        # full-bleed hero background
}


def encode(im, dst, max_w, quality):
    out = im
    if out.width > max_w:
        out = out.resize((max_w, round(out.height * max_w / out.width)), Image.LANCZOS)
    out.save(dst, "WEBP", quality=quality, method=4)
    return os.path.getsize(dst)


def load(path):
    im = Image.open(path)
    alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    return im.convert("RGBA" if alpha else "RGB")


def main():
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].lower()

    os.makedirs(PRODUCTS, exist_ok=True)
    before = after = 0
    n = 0

    for fn in sorted(os.listdir(SRC)):
        if not fn.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        if only and only not in fn.lower():
            continue
        src = os.path.join(SRC, fn)
        stem = os.path.splitext(fn)[0]
        im = load(src)
        b = os.path.getsize(src)

        if fn in SITE:
            mw, q = SITE[fn]
            a = encode(im, os.path.join(PUBLIC, stem + ".webp"), mw, q)
        else:
            a = encode(im, os.path.join(PRODUCTS, stem + ".webp"), FULL_W, FULL_Q)
            a += encode(im, os.path.join(PRODUCTS, stem + "-sm.webp"), SM_W, SM_Q)

        before += b
        after += a
        n += 1
        print(f"  {fn[:46]:<48}{b/1048576:>7.2f}M ->{a/1024:>6.0f}K", flush=True)

    if n:
        print(f"\n{n} images   {before/1048576:.1f} MB -> {after/1048576:.2f} MB "
              f"({100 - after/before*100:.1f}% smaller)")


if __name__ == "__main__":
    main()
