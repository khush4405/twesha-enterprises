#!/usr/bin/env python3
"""
Add the "Hose Pipes" category inside Engineering Products, containing
SEVEN PRODUCTS (not sub-categories).

Each product's variants/series are folded into its long description and into
its specification table as rows - so only 7 images are ever needed.

Structure:
  Engineering Products
    └── Hose Pipes  (category)
          ├── SFN (Secondary Fluid Network)        product
          ├── Corrugated Stainless Steel Hose      product
          ├── Corrugated Metal Hose Assemblies     product
          ├── Stripwound Metal Hose                product
          ├── Metal Bellows & Expansion Joints     product
          ├── Flexible Composite Hose              product
          └── Flexible PTFE Hose                   product

Editable afterwards in Admin -> Catalog -> Engineering Products -> Hose Pipes.
"""

import json, os, re, itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")

_ids = itertools.count(1795000000000)


def nid():
    return str(next(_ids))


def slugify(text):
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def apps(items):
    return [{"title": t, "desc": d} for t, d in items]


def build_specs(base_pairs, range_label, variants):
    """Base specs + a comma-separated summary row + one row per variant."""
    rows = [{"label": l, "value": v} for l, v in base_pairs]
    rows.append({"label": range_label, "value": ", ".join(name for name, _ in variants)})
    rows.extend({"label": name, "value": desc} for name, desc in variants)
    return rows


def product(title, short, long_desc, spec_rows, app_items):
    return {
        "type": "product",
        "id": nid(),
        "title": title,
        "slug": slugify(title),
        "image": "",
        "shortDescription": short,
        "longDescription": long_desc,
        "keySpecifications": spec_rows,
        "applications": apps(app_items),
        "requestQuoteOption": True,
    }


# --------------------------------------------------------------------------
# Application sets
# --------------------------------------------------------------------------

APPS_DATACENTRE = [
    ("Data Centre Liquid Cooling", "Coolant transfer between CDUs, manifolds, racks and cold plates."),
    ("AI & GPU Clusters", "High-density racks requiring precise coolant flow and vibration tolerance."),
    ("HVAC & Chilled Water", "Chiller, pump and air handling unit connections."),
    ("Process Cooling", "Closed-loop cooling for industrial equipment and machinery."),
]

APPS_METALHOSE = [
    ("Oil & Gas", "Loading lines, offshore platforms, refinery transfer and flare systems."),
    ("Power Generation", "Steam lines, turbine drains, boiler connections and exhaust ducting."),
    ("Chemical & Petrochemical", "Aggressive media transfer, reactor connections and vent lines."),
    ("Steel & Heavy Industry", "Furnace cooling, hydraulic lines and high-temperature transfer."),
]

APPS_EXPANSION = [
    ("Power Generation", "Boiler, turbine and condenser piping subject to thermal growth."),
    ("Refineries & Petrochemical", "Hot process lines, heat exchangers and column piping."),
    ("HVAC Systems", "Chilled and hot water distribution across building expansion gaps."),
    ("Marine & Shipbuilding", "Engine exhaust, ballast lines and deck piping."),
]

APPS_COMPOSITE = [
    ("Liquid Storage Terminals", "Tanker loading and unloading, road and rail gantries."),
    ("Marine & Bunkering", "Ship-to-shore transfer and offshore loading operations."),
    ("Chemical Processing", "Aggressive chemical transfer where flexibility is essential."),
    ("Aviation & Fuel Handling", "Refuelling operations and fuel farm distribution."),
]

APPS_PTFE = [
    ("Pharmaceutical", "Clean process transfer, CIP/SIP lines and sterile applications."),
    ("Chemical Processing", "Highly corrosive and aggressive chemical media."),
    ("Food & Beverage", "Hygienic transfer meeting food-contact requirements."),
    ("Paint & Coatings", "Solvent transfer and colour-change systems."),
]

# --------------------------------------------------------------------------
# 1. SFN (Secondary Fluid Network)
# --------------------------------------------------------------------------

SFN_BASE = [
    ("Materials", "SS 304L / SS 316L wetted parts; copper and nickel-plated options"),
    ("Coolant Compatibility", "Water, water-glycol mixtures and dielectric coolants"),
    ("Leak Testing", "Mass spectrometer helium leak detection below 1x10-9 mbar.L/s"),
    ("Welding", "Automated TIG orbital welding with parameter monitoring and logging"),
    ("Pressure Rating", "Designed to project specification, typically to 25 bar"),
    ("Temperature Range", "-20 C to +120 C for closed-loop coolant service"),
    ("Design Life", "15+ years continuous 24/7 operation"),
    ("Engineering", "Custom CAD design with thermal modelling and CFD flow analysis"),
]

SFN_VARIANTS = [
    ("Skids", "Modular engineered assemblies integrating piping, valves, manifolds, strainers and instrumentation on a single frame for CDU integration."),
    ("Flexible Hoses", "Helium-tested leak-proof hoses with high vibration tolerance and thermal resistance, connecting CDUs, manifolds and racks."),
    ("Bellows", "Expansion-rated, fatigue-tested bellows absorbing thermal movement and relieving stress on pumps, CDUs and rigid piping."),
]

sfn = product(
    "SFN (Secondary Fluid Network)",
    "Complete secondary fluid network systems for data centre liquid cooling.",
    "A secondary fluid network is the complete coolant distribution backbone of a liquid-cooled data centre, moving coolant from the coolant distribution unit through manifolds and racks to the chip cold plate. The range comprises three core families: Skids, Flexible Hoses and Bellows.\n\n"
    "Skids are factory-engineered modular assemblies that integrate piping, valves, manifolds, strainers and instrumentation into a single framed unit. Building them in a controlled workshop rather than on site cuts installation time substantially, gives far better weld quality control, and means the unit arrives pressure tested and ready to commission.\n\n"
    "Flexible Hoses carry coolant between fixed equipment and connection points that move or sit slightly out of alignment. They absorb pump vibration, accommodate thermal movement and tolerate misalignment that would otherwise transmit stress into rigid piping. Metallic construction is preferred over rubber here because it offers zero permeation, higher pressure capability, fire resistance and a far longer service life.\n\n"
    "Bellows absorb thermal expansion, pressure fluctuation and mechanical movement within the loop, relieving stress that would otherwise be carried by pumps, heat exchangers and CDUs. Every welded joint across the range is helium leak tested by mass spectrometer to below 1x10-9 mbar.L/s.",
    build_specs(SFN_BASE, "Product Families", SFN_VARIANTS),
    APPS_DATACENTRE,
)

# --------------------------------------------------------------------------
# 2. Corrugated Stainless Steel Hose
# --------------------------------------------------------------------------

CORRUGATED_BASE = [
    ("Core Material", "SS 304 / SS 304L / SS 316 / SS 316L; Inconel, Monel, Hastelloy on request"),
    ("Braid Material", "SS 304 / SS 316 wire braid, single or double layer"),
    ("Corrugation Profile", "Annular - each convolution perpendicular to the hose centre line"),
    ("Size Range", "DN 6 to DN 300 (1/4 inch to 12 inch)"),
    ("Temperature Range", "-196 C to +700 C, material dependent"),
    ("Pressure Rating", "Vacuum to 100 bar, dependent on size, braid layers and temperature"),
    ("End Connections", "Flanges, threaded NPT/BSP, camlock, union, weld ends or customer-specific"),
    ("Testing", "Hydrostatic, pneumatic and leak tested with dimensional inspection"),
    ("Certification", "Material traceability and test certificates supplied on request"),
]

CORRUGATED_VARIANTS = [
    ("Series A100", "Unbraided annular corrugated core - maximum flexibility where pressure capability is secondary."),
    ("Series A101", "Single wire braided - braid restrains convolutions against elongation, raising working pressure while retaining flexibility."),
    ("Series A102", "Double wire braided - highest pressure capability in the standard range, with a larger minimum bend radius."),
    ("Series A200", "Close-pitch convolution profile - more corrugations per unit length for a tighter bend radius and continuous flexing duty."),
    ("Series A300", "Heavy-duty construction - thicker wall and reinforced profile for severe service and cyclic fatigue resistance."),
    ("Series A400", "Lightweight construction - reduced weight and increased flexibility for moderate-pressure applications."),
    ("Series A700", "Large-diameter construction - high flow volume while retaining corrugated movement absorption."),
    ("Series A800", "High-pressure construction - wall thickness, convolution geometry and braid optimised for elevated pressure."),
    ("Series A1000", "Braided hose series - general industrial assemblies across a broad span of sizes and end connections."),
]

corrugated = product(
    "Corrugated Stainless Steel Hose",
    "Annular corrugated stainless steel hose in unbraided, single and double braided constructions.",
    "Corrugated stainless steel hose is manufactured from a cylindrical thin-walled tube, rolled from strip and welded at the seam, into which an annular corrugated profile is impressed. Because each convolution sits perpendicular to the hose centre line, it moves largely independently of its neighbours - and that is precisely what gives this hose its combination of tight bend radius and a pressure-tight core.\n\n"
    "The range spans nine constructions: Series A100, A101, A102, A200, A300, A400, A700, A800 and A1000.\n\n"
    "The key variable across the range is braiding. An unbraided core (A100) flexes most freely but carries limited pressure, because internal pressure tends to elongate the convolutions axially. Adding a single braid layer (A101) restrains that elongation and raises the working pressure substantially; a second layer (A102) raises it further, at the cost of a larger minimum bend radius. Beyond braiding, the range varies convolution pitch for flexibility (A200), wall thickness for durability (A300, A400), and diameter and pressure capability for specific duties (A700, A800, A1000).\n\n"
    "Stainless construction handles steam lines, exhaust systems, hot oil transfer and thermal fluid applications where rubber or polymer hose would fail under heat, and the corrugated form absorbs pump and compressor vibration, thermal expansion and equipment misalignment.",
    build_specs(CORRUGATED_BASE, "Available Series", CORRUGATED_VARIANTS),
    APPS_METALHOSE,
)

# --------------------------------------------------------------------------
# 3. Corrugated Metal Hose Assemblies
# --------------------------------------------------------------------------

ASSEMBLY_BASE = [
    ("Hose Core", "Annular corrugated SS 304 / SS 316 with single or double braid"),
    ("Size Range", "DN 6 to DN 300 (1/4 inch to 12 inch)"),
    ("Temperature Range", "-196 C to +700 C, material dependent"),
    ("Pressure Rating", "Vacuum to 100 bar, construction dependent"),
    ("Fitting Attachment", "TIG welded, fully penetrated and pressure tested as a unit"),
    ("Testing", "Hydrostatic, pneumatic and leak testing with dimensional inspection"),
    ("Documentation", "Material traceability and test certificates supplied on request"),
]

ASSEMBLY_VARIANTS = [
    ("Assembly For Metal Hose", "Standard finished assemblies - hose core, braid and end fittings welded and tested as a complete unit."),
    ("Special Metal Hose Assemblies", "Custom-engineered assemblies: non-standard lengths, mixed end connections, interlocked outer casings, jacketed constructions and special alloys."),
    ("End Connections", "Flanges to ASME B16.5 / EN 1092-1, threaded NPT and BSP, camlock and quick-release couplings, union, sanitary tri-clamp and plain weld ends."),
]

assemblies = product(
    "Corrugated Metal Hose Assemblies",
    "Complete welded and tested metal hose assemblies with fitted end connections.",
    "A hose assembly is the finished, installable article: a corrugated hose core, braid where specified, and end fittings welded on and tested as a single unit. Assembly quality matters at least as much as the hose specification itself, because the large majority of in-service failures originate at the fitting-to-hose weld rather than in the hose body.\n\n"
    "The range covers three areas: Assembly For Metal Hose, Special Metal Hose Assemblies, and End Connections.\n\n"
    "Standard assemblies cover catalogue lengths and common terminations. Special assemblies address what standard items cannot: unusual lengths, differing fittings at each end, interlocked outer casings for mechanical protection, jacketed constructions for temperature control, and specific alloys for aggressive media.\n\n"
    "End connections determine how the assembly integrates with the surrounding system, and the choice affects service life as much as the hose specification does. Available terminations include flanges to ASME and EN standards, threaded NPT and BSP fittings, camlock and quick-release couplings, union connections, sanitary tri-clamp fittings and plain weld ends. Every assembly is supplied pressure tested with full documentation.",
    build_specs(ASSEMBLY_BASE, "Assembly Types", ASSEMBLY_VARIANTS),
    APPS_METALHOSE,
)

# --------------------------------------------------------------------------
# 4. Stripwound Metal Hose
# --------------------------------------------------------------------------

STRIPWOUND_BASE = [
    ("Core Material", "SS 304 / SS 316 / galvanised steel strip"),
    ("Construction", "Interlocked helical strip wound profile"),
    ("Size Range", "DN 8 to DN 300 (5/16 inch to 12 inch)"),
    ("Temperature Range", "-100 C to +600 C, material dependent"),
    ("Key Properties", "High mechanical strength, very tight bend radius, excellent abrasion resistance"),
    ("Typical Use", "Mechanical protection, ducting and low-pressure conveying"),
    ("End Connections", "Flanges, threaded ends, cuffs or customer-specific fittings"),
]

STRIPWOUND_VARIANTS = [
    ("Series A1201", "Unpacked interlocked profile - not pressure tight; used for mechanical protection, cable guarding and low-pressure ducting."),
    ("Series A1202", "Packed with graphite or PTFE cord - substantially tight, allowing low-pressure conveying while retaining mechanical robustness."),
    ("Series A1203", "Heavy-duty strip profile - increased crush and abrasion resistance for hot solids conveying, exhaust ducting and impact exposure."),
]

stripwound = product(
    "Stripwound Metal Hose",
    "Interlocked helical stripwound metal hose for mechanical protection and ducting.",
    "Stripwound hose is formed by helically winding and interlocking a profiled metal strip, rather than by corrugating a tube. That difference in construction defines what it is good for: the result is not inherently pressure tight, but it is exceptionally strong mechanically, bends to a very tight radius, and resists abrasion far better than a corrugated hose can.\n\n"
    "Three constructions are available: Series A1201, A1202 and A1203.\n\n"
    "The unpacked form (A1201) is used where containment is not required - mechanical protection, cable guarding and low-pressure ducting. Adding a graphite or PTFE packing cord into the interlocked profile (A1202) makes the hose substantially tight, allowing it to convey material at low pressure while keeping the tight bend radius and mechanical strength of the stripwound form. A heavier strip profile (A1203) increases crush resistance and abrasion life for the most demanding duty, such as hot solids conveying and exhaust ducting where the hose is exposed to impact or dragging.",
    build_specs(STRIPWOUND_BASE, "Available Series", STRIPWOUND_VARIANTS),
    APPS_METALHOSE,
)

# --------------------------------------------------------------------------
# 5. Metal Bellows & Expansion Joints
# --------------------------------------------------------------------------

BELLOWS_BASE = [
    ("Bellows Material", "SS 304 / SS 321 / SS 316L / Inconel 625 / Incoloy 800"),
    ("Size Range", "DN 25 to DN 4000 (1 inch to 160 inch)"),
    ("Pressure Rating", "Vacuum to 40 bar, design dependent"),
    ("Temperature Range", "-196 C to +800 C, material dependent"),
    ("Design Standard", "EJMA (Expansion Joint Manufacturers Association) / ASME Section VIII Div. 1"),
    ("Ply Configuration", "Single ply or multi-ply to suit pressure and movement requirements"),
    ("End Connections", "Weld ends, flanged to ASME B16.5 / EN 1092-1, or threaded"),
    ("Accessories", "Tie rods, hinges, gimbal rings, internal liners, covers and limit rods"),
    ("Testing", "Hydrostatic, pneumatic and helium leak testing available"),
]

BELLOWS_VARIANTS = [
    ("Axial Expansion Joint", "Absorbs movement along the pipe axis only. Simplest and most economical type, but requires correctly designed anchors and guides to resist pressure thrust."),
    ("Universal / Lateral Expansion Joint", "Two bellows in series separated by a centre spool, absorbing lateral offset as well as axial movement. Tie rods restrain pressure thrust internally, reducing anchor loads."),
    ("Hinged Angular Expansion Joint", "Permits angular rotation in a single plane, with hinge pins carrying full pressure thrust. Used in sets of two or three to absorb large movements at low anchor load."),
    ("Gimbal Angular Expansion Joint", "Two-axis gimbal ring permits angular rotation in any plane while restraining pressure thrust. Paired with hinged units for three-dimensional movement."),
    ("Internal / Inline Pressure Balanced Expansion Joint", "Additional balancing bellows and tie rods cancel pressure thrust internally, allowing large axial movement where piping cannot be adequately anchored."),
    ("External Pressure Balanced Expansion Joint", "Thrust cancellation with the balancing element outside the flow path, for installations where internal balancing geometry cannot be accommodated."),
    ("Elbow Pressure Balanced Expansion Joint", "Installed at a change of direction, absorbing axial movement while cancelling pressure thrust at the elbow - common at pump and turbine nozzles."),
]

expansion = product(
    "Metal Bellows & Expansion Joints",
    "Axial, universal, hinged, gimbal and pressure-balanced expansion joints to EJMA and ASME.",
    "Expansion joints absorb thermal growth, vibration, pressure fluctuation and misalignment within a piping system, relieving stress that would otherwise be carried by pumps, turbines, heat exchangers and the pipework itself. All units are designed to EJMA guidelines and, where required, ASME Section VIII Division 1.\n\n"
    "Seven configurations are available: Axial, Universal / Lateral, Hinged Angular, Gimbal Angular, Internal / Inline Pressure Balanced, External Pressure Balanced and Elbow Pressure Balanced.\n\n"
    "Selecting between them is largely a question of how pressure thrust is handled. A plain axial joint is the simplest and cheapest, but it imposes a real condition on the design: the piping must be properly anchored and guided, because an unrestrained axial joint will simply be extended by pressure thrust instead of absorbing movement. Tied universal, hinged and gimbal arrangements restrain that thrust within the joint hardware itself, which keeps anchor loads low and often makes them the practical choice where main anchors would otherwise be prohibitively large.\n\n"
    "Pressure-balanced designs go further, cancelling thrust internally so that large movement can be absorbed directly at equipment nozzles that cannot tolerate any thrust loading at all.",
    build_specs(BELLOWS_BASE, "Available Configurations", BELLOWS_VARIANTS),
    APPS_EXPANSION,
)

# --------------------------------------------------------------------------
# 6. Flexible Composite Hose
# --------------------------------------------------------------------------

COMPOSITE_BASE = [
    ("Construction", "Multi-layer thermoplastic film and fabric between inner and outer steel wire helix"),
    ("Inner Wire", "Galvanised steel, stainless steel or polypropylene-coated"),
    ("Size Range", "DN 25 to DN 300 (1 inch to 12 inch)"),
    ("Working Pressure", "10 to 14 bar depending on type and size"),
    ("Temperature Range", "-30 C to +120 C, type dependent"),
    ("Safety Factor", "4:1 burst to working pressure ratio"),
    ("Key Properties", "Lightweight, highly flexible, will not kink, leak-safe multi-layer wall"),
    ("End Fittings", "Swaged or internally fitted; flanges, camlock, TW, BSP/NPT options"),
    ("Standard", "Manufactured and tested to EN 13765 requirements"),
]

COMPOSITE_VARIANTS = [
    ("Oil", "Crude oil, diesel, petrol and lubricating oil transfer."),
    ("Chemical", "Acids, alkalis, solvents and aggressive industrial chemicals - compatibility confirmed per media."),
    ("Food", "FDA-compliant liner for edible oils, alcohol, syrups, dairy and potable water."),
    ("High Temperature", "Elevated-temperature liner for hot oils, bitumen and heated process fluids."),
    ("Vapor Recovery", "Low-pressure high-volume vapour return during loading, with antistatic construction."),
    ("LPG", "Liquefied petroleum gas transfer with electrical continuity for static dissipation."),
    ("LNG", "Cryogenic construction engineered for liquefied natural gas thermal contraction and embrittlement risk."),
    ("Loading Arms", "Repeated flexing, weathering and mechanical handling for ship-to-shore and gantry loading."),
    ("Roof Drain", "Floating roof tank drainage, flexing continuously as the roof rises and falls with tank level."),
    ("Aviation", "Aircraft refuelling and fuel farm distribution with strict cleanliness and traceability."),
    ("Light Duty", "Lightweight general-purpose transfer at moderate pressure."),
    ("PTFE", "PTFE liner giving near-universal chemical resistance within the composite wall."),
    ("Bio-Tech", "Biotechnology and pharmaceutical duty suited to sterile processing and clean-in-place regimes."),
]

composite = product(
    "Flexible Composite Hose",
    "Multi-layer composite hose for oil, chemical, food, LPG, LNG and aviation service.",
    "Composite hose is built from many layers of thermoplastic film and fabric held under compression between an inner and an outer steel wire helix. No layer is bonded to another, and that is the design's central advantage: a puncture cannot propagate through the wall the way it does in a bonded rubber hose, so a damaged composite hose tends to weep rather than burst. This is why composite construction is preferred for hydrocarbon and hazardous media transfer.\n\n"
    "Thirteen types are available: Oil, Chemical, Food, High Temperature, Vapor Recovery, LPG, LNG, Loading Arms, Roof Drain, Aviation, Light Duty, PTFE and Bio-Tech.\n\n"
    "The types differ principally in liner material and wire specification, matched to the media being carried. Hydrocarbon and gas duties (Oil, LPG, LNG, Vapor Recovery, Aviation) rely on electrical continuity through the wire helices to dissipate the static charge generated during transfer. Cryogenic service (LNG) requires materials that stay ductile at very low temperature, where ordinary polymers become brittle. Hygienic duties (Food, Bio-Tech) use FDA-compliant liners with cleanable bores.\n\n"
    "Across all types the hose is lightweight, will not kink, and is manufactured and tested to EN 13765 with a 4:1 safety factor. Chemical compatibility should always be confirmed against the specific media and concentration before selection.",
    build_specs(COMPOSITE_BASE, "Available Types", COMPOSITE_VARIANTS),
    APPS_COMPOSITE,
)

# --------------------------------------------------------------------------
# 7. Flexible PTFE Hose
# --------------------------------------------------------------------------

PTFE_BASE = [
    ("Liner Material", "Virgin PTFE, or carbon-black antistatic PTFE for conductive service"),
    ("Braid Material", "SS 304 / SS 316 wire braid; polypropylene or silicone cover optional"),
    ("Size Range", "DN 5 to DN 100 (3/16 inch to 4 inch)"),
    ("Temperature Range", "-70 C to +260 C"),
    ("Pressure Rating", "Up to 350 bar depending on size and construction"),
    ("Chemical Resistance", "Near-universal - inert to almost all industrial chemicals"),
    ("Key Properties", "Non-ageing, non-contaminating, very low friction, self-cleaning bore"),
    ("End Connections", "Swaged SS 316 fittings, flanges, sanitary tri-clamp, threaded"),
    ("Certification", "FDA-compliant liner material available; test certificates on request"),
]

PTFE_VARIANTS = [
    ("Smooth Bore PTFE Flexible Hose", "Smooth internal bore giving the lowest flow resistance and nothing for residue to lodge against - the standard for hygienic and high-purity duty."),
    ("Convoluted PTFE Flexible Hose", "Convoluted liner profile trading some flow efficiency for a much tighter minimum bend radius and greater flexibility in repeated-flex service."),
]

ptfe = product(
    "Flexible PTFE Hose",
    "Smooth bore and convoluted PTFE hose with stainless braid for chemical and hygienic service.",
    "PTFE hose combines a chemically inert fluoropolymer liner with a stainless steel wire braid that provides the pressure containment. PTFE is inert to virtually every industrial medium, does not age or embrittle with time, and will not contaminate the product passing through it - which is why it dominates pharmaceutical, high-purity chemical and food-contact applications where liner breakdown is unacceptable.\n\n"
    "Two constructions are available: Smooth Bore PTFE Flexible Hose and Convoluted PTFE Flexible Hose.\n\n"
    "The choice between them is a straightforward trade-off. A smooth bore gives the lowest flow resistance and leaves nothing for residue to lodge against, making it the right answer for hygienic and high-purity duty where cleanability governs. A convoluted liner sacrifices some flow efficiency in exchange for a considerably tighter minimum bend radius and much greater flexibility, which is what you want where the hose must route around obstructions or flex repeatedly in service.\n\n"
    "Both are available with antistatic carbon-black liners for conductive service, and with FDA-compliant liner material where food contact applies.",
    build_specs(PTFE_BASE, "Available Constructions", PTFE_VARIANTS),
    APPS_PTFE,
)

# --------------------------------------------------------------------------
# Assemble and merge
# --------------------------------------------------------------------------

HOSE_PRODUCTS = [sfn, corrugated, assemblies, stripwound, expansion, composite, ptfe]

hose_pipes = {
    "type": "category",
    "id": nid(),
    "title": "Hose Pipes",
    "slug": "hose-pipes",
    "description": (
        "Stainless steel flexible flow solutions - corrugated and stripwound metal hose, "
        "metal bellows and expansion joints, composite and PTFE hose, and complete secondary "
        "fluid network systems for data centre liquid cooling."
    ),
    "children": HOSE_PRODUCTS,
}


def main():
    with open(DATA, encoding="utf-8") as f:
        content = json.load(f)

    eng = next((c for c in content["categories"] if c.get("slug") == "engineering-products"), None)
    if eng is None:
        raise SystemExit("Engineering Products category not found.")

    eng.setdefault("children", [])
    idx = next((i for i, c in enumerate(eng["children"]) if c.get("slug") == "hose-pipes"), None)
    if idx is None:
        eng["children"].append(hose_pipes)
        action = "Added"
    else:
        eng["children"][idx] = hose_pipes
        action = "Replaced"

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print(f"{action} 'Hose Pipes' inside Engineering Products.")
    print(f"  Products (no sub-categories): {len(HOSE_PRODUCTS)}")
    for p in HOSE_PRODUCTS:
        variants = sum(1 for s in p["keySpecifications"]) - 0
        print(f"    - {p['title']:<40} {len(p['keySpecifications']):>2} spec rows")
    print(f"\n  Images needed for this category: {len(HOSE_PRODUCTS)} (one per product)")


if __name__ == "__main__":
    main()
