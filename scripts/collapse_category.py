#!/usr/bin/env python3
"""
Collapse a named category into a single PRODUCT card.

Its child products are removed and folded into the new card as a
comma-separated summary row, one spec row each, and merged long descriptions.

Usage:
    python scripts/collapse_category.py flanges
    python scripts/collapse_category.py flanges --dry-run
"""

import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from collapse_leaf_categories import collapse  # reuse the same folding logic


def find_parent_and_index(nodes, slug):
    """Return (parent_list, index) of the category with this slug, at any depth."""
    for i, n in enumerate(nodes):
        if n.get("slug") == slug and n.get("type") == "category":
            return nodes, i
        if n.get("type") == "category":
            found = find_parent_and_index(n.get("children", []), slug)
            if found:
                return found
    return None


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    if not args:
        raise SystemExit("Usage: python scripts/collapse_category.py <category-slug> [--dry-run]")
    slug = args[0]

    with open(DATA, encoding="utf-8") as f:
        content = json.load(f)

    found = find_parent_and_index(content["categories"], slug)
    if not found:
        raise SystemExit(f"Category '{slug}' not found.")
    parent, idx = found
    cat = parent[idx]

    kids = cat.get("children", [])
    if not kids:
        raise SystemExit(f"'{cat['title']}' has no children to fold in.")
    if not all(c.get("type") == "product" for c in kids):
        raise SystemExit(f"'{cat['title']}' contains sub-categories; collapse those first.")

    names = [c["title"] for c in kids]
    parent[idx] = collapse(cat)

    print(f"Collapsed '{cat['title']}' into a single product card.")
    print(f"  Removed {len(kids)} child products, folded in as values:")
    for n in names:
        print(f"     - {n}")
    print(f"\n  Spec rows on the new card : {len(parent[idx]['keySpecifications'])}")
    print(f"  Route                     : .../{slug}")

    if dry:
        print("\n[--dry-run] nothing written.")
        return

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {DATA}")


if __name__ == "__main__":
    main()
