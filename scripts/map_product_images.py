#!/usr/bin/env python3
"""
Map image files onto products/categories in src/data/masterContent.json.

USAGE
  1. Drop your image files into  public/products/
  2. Name each file after the item's slug, e.g.  union-tee.jpg
     (see public/products/IMAGE-NAMING-LIST.csv for every required name)
  3. Run:   python scripts/map_product_images.py
     Dry run: python scripts/map_product_images.py --dry-run

Matching is deliberately forgiving. A file matches if, after stripping the
extension and normalising (lowercase, spaces/underscores -> hyphens, punctuation
removed), it equals the item's slug OR the item's normalised title. So
"Union Tee.jpg", "union_tee.png" and "union-tee.JPG" all map to Union Tee.

Accepted extensions: .jpg .jpeg .png .webp .avif .gif .svg
Existing images are preserved unless --overwrite is passed.
"""

import json, os, re, sys, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")
IMGDIR = os.path.join(ROOT, "public", "products")
WEBPREFIX = "/products/"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"}

# Filenames that don't match their item's slug. Maps item slug -> file stem.
ALIASES = {
    "heating-solution-and-temperature-measurement": "temperature-measurement",
    "pressure-gauges-and-transmitters": "pressure-measurement",
    "analytical-instruments-and-pneumatic-products": "ph-sensor",
    "dew-point-and-humidity-transmitters": "dew-transmitter",
}


def norm(text):
    text = str(text).lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def collect_files():
    """Return {normalised_basename: web_path} for every image in public/products."""
    out = {}
    if not os.path.isdir(IMGDIR):
        return out
    for fn in sorted(os.listdir(IMGDIR)):
        stem, ext = os.path.splitext(fn)
        if ext.lower() not in EXTS:
            continue
        key = norm(stem)
        # A file already named exactly as the slug wins over a loose variant
        # (e.g. "tube-to-tube-unions.jpg" beats "tube to tube unions.png").
        if key not in out or stem == key:
            out[key] = WEBPREFIX + fn
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    ap.add_argument("--overwrite", action="store_true", help="replace images already set")
    ap.add_argument("--all-categories", action="store_true",
                    help="also map top-level categories outside Engineering Products")
    args = ap.parse_args()

    files = collect_files()
    if not files:
        print(f"No images found in {IMGDIR}")
        print("Drop your files there first, named per IMAGE-NAMING-LIST.csv")
        return

    with open(DATA, encoding="utf-8") as f:
        content = json.load(f)

    matched, skipped, missing = [], [], []
    used = set()

    def walk(nodes):
        for n in nodes:
            slug = n.get("slug", "")
            keys = [norm(slug), norm(n.get("title", ""))]
            if slug in ALIASES:
                keys.insert(0, norm(ALIASES[slug]))
            hit = next((files[k] for k in keys if k in files), None)
            label = f"{n.get('title')} ({n.get('type')})"
            # The CMS edits categories via `coverImage` and products via
            # `image`. Writing the wrong one makes admin edits look ignored.
            field = "coverImage" if n.get("type") == "category" else "image"
            if hit:
                used.add(hit)
                if n.get(field) and not args.overwrite:
                    skipped.append((label, n[field]))
                else:
                    n[field] = hit
                    matched.append((label, hit))
            else:
                if not n.get(field):
                    missing.append(label)
            if n.get("type") == "category":
                walk(n.get("children", []))

    roots = content.get("categories", [])
    if not args.all_categories:
        roots = [c for c in roots if c.get("slug") == "engineering-products"]
    walk(roots)

    unused = [p for p in files.values() if p not in used]

    print(f"Images found in public/products : {len(files)}")
    print(f"Mapped                          : {len(matched)}")
    print(f"Already had an image (skipped)  : {len(skipped)}")
    print(f"Items still without an image    : {len(missing)}")
    print(f"Image files that matched nothing: {len(unused)}")

    if matched:
        print("\nMAPPED:")
        for lbl, p in matched[:40]:
            print(f"   {lbl:<52} -> {p}")
        if len(matched) > 40:
            print(f"   ... and {len(matched)-40} more")

    if unused:
        print("\nFILES THAT MATCHED NOTHING (check the filename):")
        for p in unused[:25]:
            print(f"   {p}")
        if len(unused) > 25:
            print(f"   ... and {len(unused)-25} more")

    if missing:
        print("\nSTILL WITHOUT AN IMAGE:")
        for lbl in missing[:25]:
            print(f"   {lbl}")
        if len(missing) > 25:
            print(f"   ... and {len(missing)-25} more")

    if args.dry_run:
        print("\n[--dry-run] Nothing was written.")
        return

    if matched:
        with open(DATA, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        print(f"\nSaved {DATA}")
    else:
        print("\nNothing to write.")


if __name__ == "__main__":
    main()
