#!/usr/bin/env python3
"""
Collapse the deepest level of the Engineering Products tree.

RULE
  Any CATEGORY sitting two levels below Engineering Products whose children are
  all products is converted into a single PRODUCT card. Its former child
  products are removed and folded into the new card:
     - a comma-separated summary row listing every former child
     - one specification row per former child, carrying its description
     - the long description gains a paragraph naming and explaining them

  Categories that already hold products directly (Flanges, Tubes, Sampling
  Bombs, Instrumentation Hardware, Check/Relief) are LEFT UNTOUCHED.

BEFORE  Engineering Products > Tube Fittings > Tube to Tube Unions > Union
AFTER   Engineering Products > Tube Fittings > Tube to Tube Unions   (product)

Run:  python scripts/collapse_leaf_categories.py [--dry-run]
"""

import json, os, sys, copy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")

# Wording used for the comma-separated summary row, per category slug.
RANGE_LABEL = {
    "needle-valves": "Available Configurations",
    "ball-valves": "Available Configurations",
    "gate-valves": "Available Pressure Classes",
    "globe-valves": "Available Pressure Classes",
    "2-way-manifold-valves": "Available Configurations",
    "3-way-manifold-valves": "Available Configurations",
    "5-way-manifold-valves": "Available Configurations",
    "nipples": "Available Types",
    "components": "Items Included",
    "end-connections": "Available Types",
}
DEFAULT_RANGE_LABEL = "Types Included"


def collapse(cat):
    """Turn a category whose children are products into a single product."""
    children = cat["children"]

    # Base specs: every child in a family shares the same spec block, so take
    # the first child's rows as the shared technical data.
    base_specs = copy.deepcopy(children[0].get("keySpecifications", []))
    applications = copy.deepcopy(children[0].get("applications", []))

    names = [c["title"] for c in children]
    label = RANGE_LABEL.get(cat.get("slug", ""), DEFAULT_RANGE_LABEL)

    # A lone child with the same name as its parent adds nothing - skip the
    # summary row and the per-child row, which would just repeat the title.
    redundant = len(children) == 1 and children[0]["title"].strip() == cat["title"].strip()

    specs = base_specs
    if not redundant:
        specs.append({"label": label, "value": ", ".join(names)})
        for c in children:
            specs.append({
                "label": c["title"],
                "value": c.get("shortDescription", "").strip(),
            })

    # Long description: category intro + a paragraph naming the variants,
    # then each variant's own long description.
    intro = cat.get("description", "").strip()
    parts = []
    if intro:
        parts.append(intro)
    if not redundant:
        parts.append(
            f"This range covers {len(names)} variants: " + ", ".join(names) + "."
        )
    for c in children:
        body = (c.get("longDescription") or "").strip()
        if body:
            parts.append(body if redundant else f"{c['title']} — {body}")

    return {
        "type": "product",
        "id": cat["id"],
        "title": cat["title"],
        "slug": cat["slug"],
        "image": cat.get("image", "") or cat.get("coverImage", "") or "",
        "shortDescription": (
            intro if len(intro) <= 160
            else intro[:157].rsplit(" ", 1)[0] + "..."
        ) or f"{cat['title']} range covering {len(names)} variants.",
        "longDescription": "\n\n".join(parts),
        "keySpecifications": specs,
        "applications": applications,
        "requestQuoteOption": True,
    }


def main():
    dry = "--dry-run" in sys.argv

    with open(DATA, encoding="utf-8") as f:
        content = json.load(f)

    eng = next((c for c in content["categories"] if c.get("slug") == "engineering-products"), None)
    if eng is None:
        raise SystemExit("Engineering Products not found.")

    collapsed, untouched = [], []

    # Level 1 = Tube Fittings, Pipe Fittings, Valves, Flanges, ...
    for lvl1 in eng.get("children", []):
        if lvl1.get("type") != "category":
            continue
        new_children = []
        for lvl2 in lvl1.get("children", []):
            # Level 2 category whose children are all products -> collapse it
            if (lvl2.get("type") == "category"
                    and lvl2.get("children")
                    and all(c.get("type") == "product" for c in lvl2["children"])):
                n = len(lvl2["children"])
                new_children.append(collapse(lvl2))
                collapsed.append((lvl1["title"], lvl2["title"], n))
            else:
                new_children.append(lvl2)
        lvl1["children"] = new_children

        if not any(c[0] == lvl1["title"] for c in collapsed):
            untouched.append((lvl1["title"], len(lvl1.get("children", []))))

    def cnt(nodes):
        return sum(1 if n["type"] == "product" else cnt(n.get("children", [])) for n in nodes)

    print("COLLAPSED (category -> single product card):")
    for parent, name, n in collapsed:
        print(f"   {parent} > {name:<34} {n:>2} children folded in")

    print("\nLEFT AS-IS (already one level deep):")
    for name, n in untouched:
        print(f"   {name:<40} {n:>2} products")

    total = cnt(eng["children"])
    print(f"\nEngineering Products total: {total} products  (images needed: {total})")

    if dry:
        print("\n[--dry-run] nothing written.")
        return

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {DATA}")


if __name__ == "__main__":
    main()
