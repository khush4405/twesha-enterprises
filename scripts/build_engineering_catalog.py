#!/usr/bin/env python3
"""
Build the Engineering Products catalog tree and merge it into src/data/masterContent.json.

Everything produced here is fully editable afterwards in the CMS
(Admin -> Catalog -> Engineering Products), because it uses exactly the same
schema the Catalog Manager reads/writes:

  category = { type, title, slug, id, description, children[] }
  product  = { type, title, slug, id, image, shortDescription, longDescription,
               keySpecifications[{label,value}], applications[{title,desc}],
               requestQuoteOption }
"""

import json, os, re, itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")

_ids = itertools.count(1790000000000)


def nid():
    return str(next(_ids))


def slugify(text):
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


# --------------------------------------------------------------------------
# Shared specification blocks (industry-standard values for each family)
# --------------------------------------------------------------------------

TUBE_FITTING_SPECS = [
    ("Material Grades", "SS 316 / SS 316L / SS 304 / SS 304L, Brass, Carbon Steel, Monel 400, Inconel 625, Hastelloy C-276, Duplex 2205"),
    ("Imperial Size Range", '1/16" to 1" tube OD'),
    ("Metric Size Range", "3 mm to 25 mm tube OD"),
    ("Ferrule Design", "Twin ferrule (front and back), non-rotating grip"),
    ("Working Pressure", "Up to 10,000 psi (690 bar), size and material dependent"),
    ("Temperature Range", "-65 °C to +650 °C, material dependent"),
    ("Raw Material Standard", "ASTM A479 / ASTM A182 bar stock"),
    ("Thread Standards", "NPT to ASME B1.20.1, BSPT/BSPP to ISO 7 / ISO 228"),
    ("Surface Finish", "32 Ra max on sealing surfaces"),
    ("Testing", "100% pneumatic leak tested; material traceable to heat number"),
]

PIPE_FITTING_SPECS = [
    ("Material Grades", "SS 316 / SS 316L / SS 304 / SS 304L, Brass, Carbon Steel, Monel, Inconel, Hastelloy"),
    ("Size Range", '1/8" to 1" NPT'),
    ("Working Pressure", "Up to 6,000 psi (413 bar)"),
    ("Temperature Range", "-65 °C to +650 °C, material dependent"),
    ("Thread Standard", "NPT to ASME B1.20.1; BSPT/BSPP to ISO 7 / ISO 228"),
    ("Raw Material Standard", "ASTM A479 / ASTM A182"),
    ("Surface Finish", "Machined, burr-free, thread gauge inspected"),
    ("Testing", "Dimensional and thread gauge inspection; material traceability provided"),
]

SOCKET_WELD_SPECS = [
    ("Material Grades", "ASTM A182 F304 / F304L / F316 / F316L / F321 / F11 / F22, ASTM A105 Carbon Steel"),
    ("Pressure Class", "3000# / 6000# / 9000#"),
    ("Size Range", '1/8" to 4" NB'),
    ("Design Standard", "ASME B16.11 / BS 3799 / MSS SP-79 / MSS SP-83"),
    ("End Connection", "Socket weld (NBSW)"),
    ("Temperature Range", "-45 °C to +650 °C, material dependent"),
    ("Testing", "Hydrostatic testing available; PMI and MTC to EN 10204 3.1"),
    ("Surface Treatment", "Pickled and passivated"),
]

THREADED_FITTING_SPECS = [
    ("Material Grades", "ASTM A182 F304 / F304L / F316 / F316L, ASTM A105 Carbon Steel"),
    ("Pressure Class", "2000# / 3000# / 6000#"),
    ("Size Range", '1/8" to 4" NB'),
    ("Design Standard", "ASME B16.11 / BS 3799 / MSS SP-79"),
    ("End Connection", "Threaded NPT / BSPT female or male"),
    ("Temperature Range", "-45 °C to +650 °C, material dependent"),
    ("Testing", "Thread gauge inspection; MTC to EN 10204 3.1"),
    ("Surface Treatment", "Pickled and passivated"),
]

NIPPLE_SPECS = [
    ("Material Grades", "ASTM A312 / A106 Gr.B pipe in SS 316 / SS 316L / SS 304 / Carbon Steel"),
    ("Size Range", '1/8" to 4" NB'),
    ("Schedule", "SCH 40 / SCH 80 / SCH 160 / XXS"),
    ("Length Options", "Close, short and long nipples; custom lengths to order"),
    ("End Connections", "Plain bevel end (NBPL) and/or male NPT (NPTM)"),
    ("Design Standard", "ASME B16.11 / ASME B1.20.1 threads"),
    ("Temperature Range", "-45 °C to +650 °C, material dependent"),
    ("Testing", "Dimensional and thread inspection; MTC to EN 10204 3.1"),
]

NEEDLE_VALVE_SPECS = [
    ("Body Material", "SS 316 / SS 316L / SS 304, Monel, Inconel, Hastelloy, Carbon Steel, Brass"),
    ("Size Range", '1/8" to 1" NPT / BSP, or 1/4" to 1/2" tube OD'),
    ("Working Pressure", "Up to 6,000 psi (413 bar) at ambient temperature"),
    ("Temperature Range", "-40 °C to +540 °C depending on packing"),
    ("Stem Type", "Non-rotating, hardened and ground stem tip"),
    ("Packing Material", "PTFE standard; Grafoil for high temperature service"),
    ("Seat Design", "Integral metal-to-metal seat"),
    ("Handle", "Aluminium bar handle; T-bar and locking options available"),
    ("Testing", "100% hydrostatic shell and seat tested"),
    ("Design Standard", "Manufactured to BS 6755 / API 598 test criteria"),
]

BALL_VALVE_SPECS = [
    ("Body Material", "SS 316 / SS 316L / SS 304, Brass, Carbon Steel, Monel"),
    ("Size Range", '1/4" to 1" NPT / BSP / tube OD'),
    ("Working Pressure", "Up to 6,000 psi (413 bar), seat material dependent"),
    ("Temperature Range", "-40 °C to +200 °C with PTFE seats"),
    ("Ball & Stem", "Precision-machined SS 316 ball, blow-out proof stem"),
    ("Seat Material", "PTFE / RPTFE / PEEK options"),
    ("Port Design", "Full bore and reduced bore options"),
    ("Operation", "Quarter-turn 90° lever, lockable handle option"),
    ("Testing", "100% hydrostatic shell and seat tested"),
    ("Design Standard", "Tested to API 598 / BS 6755 criteria"),
]

GATE_VALVE_SPECS = [
    ("Body Material", "ASTM A182 F316 / F304 / F51, ASTM A105 Carbon Steel"),
    ("Pressure Class", "800# / 1500# / 2500#"),
    ("Size Range", '1/4" to 2" NB'),
    ("End Connections", "Screwed NPT, socket weld, or flanged to ASME B16.5"),
    ("Bonnet Design", "Bolted bonnet, outside screw and yoke (OS&Y)"),
    ("Trim Material", "SS 410 / SS 316 / Stellite faced"),
    ("Packing", "Graphite / PTFE gland packing"),
    ("Temperature Range", "-29 °C to +540 °C, material dependent"),
    ("Design Standard", "BS 5352 / API 602 design, API 598 testing"),
    ("Testing", "100% hydrostatic shell and seat tested"),
]

GLOBE_VALVE_SPECS = [
    ("Body Material", "ASTM A182 F316 / F304 / F51, ASTM A105 Carbon Steel"),
    ("Pressure Class", "800# / 1500# / 2500#"),
    ("Size Range", '1/4" to 2" NB'),
    ("End Connections", "Screwed NPT, socket weld, or flanged to ASME B16.5"),
    ("Bonnet Design", "Bolted bonnet, outside screw and yoke (OS&Y)"),
    ("Trim Material", "SS 410 / SS 316 / Stellite faced plug and seat"),
    ("Flow Pattern", "Straight and angle patterns available"),
    ("Temperature Range", "-29 °C to +540 °C, material dependent"),
    ("Design Standard", "BS 5352 / API 602 design, API 598 testing"),
    ("Testing", "100% hydrostatic shell and seat tested"),
]

MANIFOLD_SPECS = [
    ("Body Material", "SS 316 / SS 316L / SS 304, Monel, Hastelloy, Carbon Steel"),
    ("Working Pressure", "Up to 6,000 psi (413 bar) at ambient temperature"),
    ("Temperature Range", "-40 °C to +540 °C depending on packing"),
    ("Port Connections", '1/2" NPT female standard; flanged and tube OD options'),
    ("Instrument Mounting", "Direct mount to transmitter, or remote mount with brackets"),
    ("Stem Design", "Non-rotating hardened stem tip, back-seated"),
    ("Packing Material", "PTFE standard; Grafoil for high temperature service"),
    ("Bonnet", "Anti-tamper, blow-out proof bonnet assembly"),
    ("Testing", "100% hydrostatic shell and seat tested"),
    ("Design Standard", "Manufactured and tested to BS 6755 / API 598 criteria"),
]

FLANGE_SPECS = [
    ("Material Grades", "ASTM A182 F304 / F304L / F316 / F316L / F51 / F53, ASTM A105 Carbon Steel"),
    ("Pressure Class", "150# / 300# / 600# / 900# / 1500# / 2500#"),
    ("Size Range", '1/2" to 24" NB'),
    ("Design Standard", "ASME B16.5 / ASME B16.47 / EN 1092-1 / BS 4504"),
    ("Facing Type", "Raised face (RF), flat face (FF), ring type joint (RTJ)"),
    ("Facing Finish", "Serrated / smooth finish 125-250 AARH"),
    ("Temperature Range", "-45 °C to +650 °C, material dependent"),
    ("Testing", "Ultrasonic and dimensional inspection; MTC to EN 10204 3.1"),
]

HARDWARE_SPECS = [
    ("Material Grades", "SS 316 / SS 316L / SS 304, Carbon Steel"),
    ("Working Pressure", "Rated to application; up to 6,000 psi (413 bar)"),
    ("Temperature Range", "-45 °C to +540 °C, material dependent"),
    ("Connections", "NPT / BSP threaded, socket weld and flanged options"),
    ("Mounting", "2\" pipe stand, wall or direct instrument mount"),
    ("Fabrication", "Welded assemblies to ASME IX qualified procedures"),
    ("Testing", "Hydrostatic pressure tested; MTC to EN 10204 3.1"),
]

TUBING_SPECS = [
    ("Material Grades", "SS 316 / SS 316L / SS 304 / SS 304L, Monel, Inconel, Copper"),
    ("Manufacturing Standard", "ASTM A269 / ASTM A213 / ASTM A249 seamless and welded"),
    ("Condition", "Fully annealed, bright annealed surface"),
    ("Hardness", "Maximum 80 HRB for reliable ferrule bite"),
    ("Wall Thickness", "0.028\" to 0.109\" (imperial); 0.8 mm to 2.5 mm (metric)"),
    ("Tolerance", "OD tolerance to ASTM A269 requirements"),
    ("Length", "6 metre standard lengths; coils available on request"),
    ("Testing", "Eddy current / hydrostatic tested; MTC to EN 10204 3.1"),
]

SAMPLING_SPECS = [
    ("Body Material", "SS 316 / SS 316L, Hastelloy, Monel"),
    ("Capacity Range", "75 ml, 150 ml, 300 ml, 500 ml, 1000 ml"),
    ("Working Pressure", "Up to 5,000 psi (345 bar)"),
    ("Temperature Range", "-45 °C to +200 °C"),
    ("End Connections", '1/4" or 1/2" NPT female with needle valves both ends'),
    ("Construction", "Seamless pipe body with full penetration welded ends"),
    ("Options", "Rupture disc, purge valve, carrying handle, protective cage"),
    ("Testing", "100% hydrostatic tested; MTC to EN 10204 3.1"),
]

CHECK_RELIEF_SPECS = [
    ("Body Material", "SS 316 / SS 316L / SS 304, Brass, Carbon Steel, Monel"),
    ("Size Range", '1/4" to 1" NPT / BSP / tube OD'),
    ("Working Pressure", "Up to 6,000 psi (413 bar)"),
    ("Temperature Range", "-40 °C to +200 °C, seal material dependent"),
    ("Seal Material", "Viton / PTFE / Buna-N / EPDM options"),
    ("Cracking Pressure", "1/3 psi standard; 1, 5, 10, 25, 50 psi options"),
    ("Spring Material", "SS 316 / Inconel X-750"),
    ("Testing", "100% pressure and seat tested"),
]


def specs(pairs, extra=None):
    out = [{"label": l, "value": v} for l, v in pairs]
    if extra:
        out = [{"label": l, "value": v} for l, v in extra] + out
    return out


APPS_INSTRUMENT = [
    ("Oil & Gas", "Wellhead control panels, separators, metering skids and offshore platforms."),
    ("Chemical & Petrochemical", "Corrosive media handling, reactor instrumentation and sampling lines."),
    ("Power Generation", "Boiler impulse lines, turbine instrumentation and steam service."),
    ("Pharmaceutical", "Clean process lines, autoclaves and utility distribution systems."),
]

APPS_PROCESS = [
    ("Refineries & Petrochemical", "Process isolation, drain and vent duty on high pressure lines."),
    ("Power & Utilities", "Steam, feedwater and condensate systems."),
    ("Water Treatment", "Distribution headers, dosing skids and pump isolation."),
    ("Marine & Shipbuilding", "Deck lines, ballast systems and engine room piping."),
]


def app_list(items):
    return [{"title": t, "desc": d} for t, d in items]


def product(title, short, long_desc, spec_pairs, apps=APPS_INSTRUMENT, slug=None):
    return {
        "type": "product",
        "id": nid(),
        "title": title,
        "slug": slug or slugify(title),
        "image": "",
        "shortDescription": short,
        "longDescription": long_desc,
        "keySpecifications": spec_pairs,
        "applications": app_list(apps),
        "requestQuoteOption": True,
    }


def category(title, description, children, slug=None):
    return {
        "type": "category",
        "id": nid(),
        "title": title,
        "slug": slug or slugify(title),
        "description": description,
        "children": children,
    }


# ==========================================================================
# 1. TUBE FITTINGS
# ==========================================================================

TUBE_TO_TUBE = [
    ("Union", "Straight tube-to-tube coupling for joining two equal-diameter tube runs.",
     "A straight union joins two tubes of the same outside diameter into a single leak-tight run. The twin-ferrule mechanism grips the tube wall and forms a seal without any welding, threading or flaring of the tube, which makes it the standard building block of instrumentation impulse lines. The back ferrule hinges and drives the front ferrule into the tube surface as the nut is tightened, producing a joint that can be disconnected and remade repeatedly without loss of seal integrity."),
    ("Reducing Union", "Straight union that transitions between two different tube outside diameters.",
     "A reducing union connects tubing of two different outside diameters in a single straight fitting, removing the need for a separate adapter and an extra leak path. Each end carries its own correctly sized nut and ferrule set, so both connections deliver the same gas-tight seal as a standard union. It is the usual choice when stepping down from a header run to a smaller instrument take-off."),
    ("Bulkhead Union - BU", "Panel-mounting union that passes tubing through an enclosure wall.",
     "A bulkhead union carries a tube run through a panel, cabinet or enclosure wall while providing mechanical anchorage at the crossing point. The extended body is threaded to accept a locknut, which clamps the fitting securely to the panel so vibration and tube weight are carried by the structure rather than the joint. Both ends terminate in standard twin-ferrule connections."),
    ("Union Elbow", "90° tube-to-tube elbow for changing direction in a tube run.",
     "A union elbow turns a tube run through 90° without requiring the tube itself to be bent, which is valuable in tight enclosures or where the tube wall thickness makes field bending impractical. Both ends use twin-ferrule connections, giving the same pressure rating and reusability as a straight union while keeping the routing compact and serviceable."),
    ("Union Tee", "Three-way tube fitting for branching a run into two paths.",
     "A union tee splits a single tube run into two, or combines two into one, with all three ports accepting the same tube outside diameter. It is the standard method of adding a branch for a pressure gauge, transmitter take-off or bleed point partway along an impulse line, with every port sealed by an independent twin-ferrule set."),
    ("Cross", "Four-way tube fitting for junctions requiring three branches.",
     "A cross provides a four-way junction from a single machined body, allowing three branches to be taken from one point in a tube system. This is common where a process take-off must feed a transmitter, a gauge and a bleed or calibration point simultaneously. All four ports carry independent twin-ferrule connections."),
]

TUBE_TO_MALE = [
    ("Male Connector (Imperial) - MCN", "Tube-to-male-NPT connector for imperial tube sizes.",
     "A male connector terminates an imperial tube run into a male NPT pipe thread, forming the most common transition between tubing and threaded process equipment. The tube side seals on the twin-ferrule mechanism while the pipe side seals on the tapered thread, so a single fitting bridges two entirely different sealing systems."),
    ("Male Connector (Metric) - MCN", "Tube-to-male-NPT connector for metric tube sizes.",
     "The metric male connector performs the same tube-to-pipe transition as the imperial version but accepts metric tube outside diameters from 3 mm to 25 mm. Ferrules are dimensioned specifically for metric tube wall thicknesses, which matters because using imperial ferrules on metric tube is a frequent and avoidable cause of joint failure."),
    ("Male Connector BSP Taper - MCB", "Tube connector terminating in a male BSP tapered thread.",
     "This connector terminates a tube run in a male BSP tapered (BSPT) thread to ISO 7, the prevailing pipe thread standard across European, Indian and Asian process plant. Sealing on the pipe side is achieved on the thread flanks, generally assisted by PTFE tape or an anaerobic sealant."),
    ("Male Connector BSPP - MCBP", "Tube connector with parallel BSP thread and bonded seal face.",
     "The BSPP variant uses a parallel British Standard Pipe thread, which does not seal on the threads themselves. Sealing is instead achieved on a face using a bonded washer or O-ring, giving a more repeatable and reusable joint than a tapered thread and allowing the fitting to be oriented precisely on final tightening."),
    ("Bulkhead Male Connector", "Panel-mount connector transitioning tube to male pipe thread.",
     "A bulkhead male connector combines panel mounting with a tube-to-male-pipe transition, letting a tube run pass through an enclosure wall and terminate directly into threaded equipment on the far side. The extended body accepts a locknut so the panel carries the mechanical load."),
    ("Male Elbow NPT - MEN", "90° elbow transitioning tube to male NPT thread.",
     "A male elbow combines a 90° direction change with a tube-to-male-NPT transition in one body, saving both space and a potential leak path compared with fitting a separate elbow and connector. It is widely used where a transmitter or gauge port faces an awkward direction relative to the incoming tube run."),
    ("Male Elbow BSP Taper - MEB", "90° elbow transitioning tube to male BSP tapered thread.",
     "This elbow performs a 90° turn while terminating in a male BSP tapered thread to ISO 7, suiting plant built to European and Asian piping standards. The tube side retains the standard twin-ferrule connection."),
    ("Male Elbow NPT 45° - METN", "45° elbow transitioning tube to male NPT thread.",
     "A 45° male elbow provides a shallower direction change than a standard 90° elbow, which is useful for easing tube routing around obstructions without introducing the flow restriction and installed stress of a tight bend."),
    ("Male Run Tee", "Tee with male pipe thread on the run and tube ends on the branch.",
     "A male run tee places the male pipe thread on the straight run of the tee, with tube connections on the remaining ports. This configuration is used when an instrument must be mounted inline on a continuing tube run rather than at its termination."),
    ("Male Branch Tee", "Tee with male pipe thread on the branch and tube ends on the run.",
     "A male branch tee places the male pipe thread on the branch port while the tube run passes straight through. It is the standard way to take a gauge or transmitter connection off the side of a continuing impulse line."),
]

TUBE_TO_FEMALE = [
    ("Female Connector NPT - FCN", "Tube-to-female-NPT connector for threaded male fittings.",
     "A female connector terminates a tube run in a female NPT thread, accepting a male pipe thread from process equipment. It is the mirror of the male connector and is chosen wherever the mating equipment presents a male thread."),
    ("Female Connector BSP - FCB", "Tube connector terminating in a female BSP thread.",
     "This connector terminates a tube run in a female BSP thread to ISO 7 or ISO 228, matching the pipe thread convention used across most European and Asian process installations."),
    ("BSPP Gauge Connector - MFCBP", "Gauge connector with parallel BSP thread for pressure instruments.",
     "A gauge connector is dimensioned specifically for mounting pressure gauges and similar instruments onto a tube run. The parallel BSPP thread seals on a face rather than on the threads, which allows the gauge to be rotated to a readable orientation and locked without compromising the seal."),
    ("Female Bulkhead Connector NPT - FBCN", "Panel-mount connector with female NPT termination.",
     "A female bulkhead connector passes a tube run through a panel wall and terminates it in a female NPT thread on the far side, combining mechanical anchorage with a threaded connection point."),
    ("Female Elbow", "90° elbow transitioning tube to female pipe thread.",
     "A female elbow combines a 90° direction change with a tube-to-female-thread transition, used where the mating equipment presents a male thread and the tube must approach from a perpendicular direction."),
    ("Female Run Tee", "Tee with female pipe thread on the run and tube ends on the branch.",
     "A female run tee positions the female pipe thread on the straight run of the fitting, allowing inline mounting of threaded equipment on a continuing tube run."),
    ("Female Branch Tee", "Tee with female pipe thread on the branch and tube ends on the run.",
     "A female branch tee places the female pipe thread on the branch port while the tube passes straight through the run, providing a side take-off point for threaded instruments."),
]

COMPONENTS = [
    ("Blanking End", "Tube-side cap used to seal an unused tube fitting port.",
     "A blanking end, or tube cap, seals off a fitting port that is not currently in use. It fits over the tube stub and seals on the twin-ferrule mechanism, allowing a system to be pressure tested or commissioned with spare ports left in place for future expansion."),
    ("Blanking Plug", "Solid plug that seals an open fitting body port.",
     "A blanking plug seals an unused port from the inside, occupying the position a tube would normally take. It is retained by the standard nut and ferrule set, so the sealed port carries the same pressure rating as a connected one."),
    ("Nut", "Replacement compression nut for twin-ferrule tube fittings.",
     "The nut drives the ferrule set into the tube and fitting body as it is tightened. Supplied as a spare or replacement item, it is machined with a controlled thread and drive surface so that the specified number of turns from finger-tight produces the correct, repeatable ferrule swage."),
    ("Front Ferrule", "Primary sealing ferrule for twin-ferrule tube fittings.",
     "The front ferrule creates the primary seal against both the fitting body taper and the tube surface. It is manufactured to close dimensional tolerance and controlled hardness, since the relationship between ferrule and tube hardness governs whether the joint seals reliably."),
    ("Back Ferrule", "Secondary ferrule providing tube grip and vibration resistance.",
     "The back ferrule hinges as the nut is tightened, driving the front ferrule forward while simultaneously gripping the tube wall. This grip is what gives a twin-ferrule joint its resistance to vibration and to tube pull-out under pressure."),
]

tube_fittings = category(
    "Tube Fittings",
    "Twin-ferrule instrumentation tube fittings in imperial and metric sizes, supplied in stainless steel, brass and exotic alloys for leak-tight tubing connections up to 10,000 psi.",
    [
        category("Tube to Tube Unions", "Straight, reducing, bulkhead, elbow, tee and cross fittings that join tube to tube without welding or flaring.",
                 [product(t, s, l, specs(TUBE_FITTING_SPECS)) for t, s, l in TUBE_TO_TUBE]),
        category("Tube to Male Pipe", "Connectors, elbows and tees transitioning tube runs into male NPT, BSPT and BSPP pipe threads.",
                 [product(t, s, l, specs(TUBE_FITTING_SPECS)) for t, s, l in TUBE_TO_MALE]),
        category("Tube to Female Pipe", "Connectors, elbows, tees and gauge connectors terminating tube runs in female pipe threads.",
                 [product(t, s, l, specs(TUBE_FITTING_SPECS)) for t, s, l in TUBE_TO_FEMALE]),
        category("Components", "Ferrules, nuts, caps and plugs supplied as spares and for sealing unused ports.",
                 [product(t, s, l, specs(TUBE_FITTING_SPECS)) for t, s, l in COMPONENTS]),
    ],
)


# ==========================================================================
# 2. PIPE FITTINGS
# ==========================================================================

INSTRUMENT_PIPE = [
    ("CNP Close Nipple (Male Both Ends)", "Short male NPT nipple with no unthreaded centre section.",
     "A close nipple is threaded along its entire length, giving the shortest possible male-to-male connection between two female ports. It is used to couple two components directly together where no separation is needed."),
    ("NP Hex Nipple (Male NPT Both Ends)", "Hex-bodied nipple with male NPT threads at both ends.",
     "A hex nipple carries male NPT threads on both ends with a hexagonal centre section that accepts a spanner, allowing proper torque to be applied during installation without damaging the threads."),
    ("RNP Hex Reducing Nipple", "Hex nipple stepping down from one male NPT size to a smaller one.",
     "A reducing nipple joins two female ports of differing sizes, changing pipe size and providing the connection in a single component. The hex centre allows controlled tightening."),
    ("LNP Hex Long Nipple (Male NPT Both Ends)", "Extended-length hex nipple with male NPT both ends.",
     "A long nipple provides additional separation between two connected components, useful for clearing insulation, providing thermal standoff from hot process lines, or reaching past obstructions."),
    ("AP Adaptor (Female NPT to Male NPT)", "Same-size adaptor converting female NPT to male NPT.",
     "An adaptor converts a female NPT port to a male NPT of the same nominal size, reversing the gender of a connection without changing pipe size."),
    ("RAP Reducing Adaptor", "Adaptor converting female NPT to a reduced male NPT.",
     "A reducing adaptor changes both gender and size in one component, connecting a female port to a smaller male thread."),
    ("RBP Reducing Bushing", "Bushing reducing a male NPT to a smaller female NPT.",
     "A reducing bushing fits into a larger female port and presents a smaller female thread, the standard way of stepping a port down to a smaller instrument connection."),
    ("CGP Hex Coupling (Female NPT Both Ends)", "Hex coupling with female NPT threads at both ends.",
     "A hex coupling joins two male-threaded components of the same size. The hexagonal body allows a spanner to be applied for correct assembly torque."),
    ("RCGP Reducing Coupling", "Coupling joining a male NPT to a reduced female NPT.",
     "A reducing coupling connects components of differing thread sizes while presenting female threads, providing a size transition within a threaded run."),
    ("CPP Cap (Female NPT)", "Female NPT cap for sealing an unused male port.",
     "A cap screws onto a male NPT thread to seal off an unused connection point, allowing the system to hold pressure with spare ports left available for future use."),
    ("PP Plug (Male NPT)", "Male NPT plug for sealing an unused female port.",
     "A plug screws into a female NPT port to seal it. Supplied with hex or square drive heads to suit the available installation clearance."),
    ("FLP Female Elbow (Female NPT Both Ends)", "90° elbow with female NPT threads at both ends.",
     "A female elbow turns a threaded pipe run through 90° with female connections on both ports."),
    ("SLP Street Elbow (Female to Male NPT)", "90° elbow with one female and one male NPT end.",
     "A street elbow carries a female thread on one end and a male on the other, allowing a direction change to be made directly at a port without an intermediate nipple."),
    ("RSLP Reducing Street Elbow", "Street elbow that also reduces thread size across the turn.",
     "A reducing street elbow combines a 90° turn, a gender change and a size reduction in a single component, minimising the number of joints in a compact instrument hook-up."),
    ("MLP Male Elbow (Male NPT Both Ends)", "90° elbow with male NPT threads at both ends.",
     "A male elbow turns a run through 90° while presenting male threads on both ports for connection into female-ported equipment."),
    ("FTP Female Tee (Female NPT All Ports)", "Three-way tee with female NPT on all ports.",
     "A female tee branches a threaded run into two paths with all three ports presenting female NPT threads."),
    ("STP Street Tee (Female by Run Tee)", "Tee combining female and male NPT connections.",
     "A street tee mixes male and female threads across its ports, allowing a branch to be taken without adding a separate nipple to correct thread gender."),
    ("FTBM Female Branch Tee", "Tee with the female branch connection off the run.",
     "A female branch tee provides a side take-off from a continuing run, typically for a gauge, transmitter or bleed connection."),
    ("MTP Male Tee (Male NPT All Branches)", "Three-way tee with male NPT on all ports.",
     "A male tee branches a run with male threads presented on all three ports, for direct connection into female-ported equipment."),
    ("CSP Cross (Male NPT All Ports)", "Four-way cross with male NPT on all ports.",
     "A cross provides a four-way threaded junction, allowing three branches from a single point — commonly a transmitter, a gauge and a calibration or bleed connection."),
]

SOCKET_WELD = [
    ("90° Elbow, NBSW, 3000# / 6000# / 9000#", "Forged socket weld elbow for a 90° change of direction.",
     "A forged socket weld elbow turns a pipe run through 90°. The pipe is inserted into the machined socket and fillet welded externally, producing a joint with no internal obstruction and high fatigue strength — the preferred method for small-bore high-pressure piping."),
    ("Cross, NBSW, 3000# / 6000# / 9000#", "Forged socket weld cross for four-way pipe junctions.",
     "A forged cross provides a four-way socket weld junction from a single forging, giving three branches from one point with full pressure integrity."),
    ("Equal Tee, NBSW, 3000# / 6000# / 9000#", "Forged socket weld tee with equal-sized ports.",
     "A forged equal tee branches a socket-welded pipe run into two paths, with all three ports machined to the same nominal bore."),
    ("45° Elbow, NBSW, 3000# / 6000# / 9000#", "Forged socket weld elbow for a 45° change of direction.",
     "A 45° forged elbow provides a shallower direction change than a 90°, reducing pressure drop and turbulence where a gentler route is acceptable."),
    ("Full Coupling, NBSW, 3000# / 6000# / 9000#", "Forged coupling with sockets at both ends.",
     "A full coupling joins two lengths of pipe in a straight run, with a machined socket at each end to receive the pipe ends for fillet welding."),
    ("Half Coupling, NBSW, 3000# / 6000# / 9000#", "Forged coupling with a single socket for branch connections.",
     "A half coupling has one socket end and is welded directly onto a vessel wall or larger pipe to create a branch or instrument take-off point."),
    ("3 Piece Union, NBSW, 3000# / 6000# / 9000#", "Forged three-piece union allowing pipe runs to be broken.",
     "A three-piece union consists of two tail pieces and a central nut, letting a welded pipe run be disconnected for maintenance without cutting. It is placed wherever equipment must be periodically removed."),
]

THREADED_FITTINGS = [
    ("90° Elbow, Threaded, 3000# / 6000#", "Forged threaded elbow for a 90° change of direction.",
     "A forged threaded elbow turns a pipe run through 90° using NPT or BSPT threads, allowing assembly without welding — valuable where hot work is restricted or where lines must be dismantled."),
    ("45° Elbow, Threaded, 3000# / 6000#", "Forged threaded elbow for a 45° change of direction.",
     "A 45° threaded elbow provides a gentler direction change than a 90°, easing routing while retaining a fully mechanical, weld-free joint."),
    ("Equal Tee, Threaded, 3000# / 6000#", "Forged threaded tee with equal-sized ports.",
     "A forged threaded tee branches a pipe run into two paths with all three ports carrying the same nominal thread size."),
    ("Cross, Threaded, 3000# / 6000#", "Forged threaded cross for four-way junctions.",
     "A forged threaded cross gives a four-way junction from a single forging, providing three branch points without any welding."),
    ("Full Coupling, Threaded, 3000# / 6000#", "Forged threaded coupling with female threads both ends.",
     "A full coupling joins two male-threaded pipe ends in a straight run, presenting female threads at both ends."),
    ("Half Coupling, Threaded, 3000# / 6000#", "Forged threaded coupling for branch take-offs.",
     "A half coupling is welded or screwed onto a larger pipe or vessel to create a single threaded branch or instrument connection point."),
    ("Union, Threaded, 3000# / 6000#", "Forged threaded union allowing runs to be dismantled.",
     "A threaded union lets a pipe run be broken and remade without disturbing adjacent joints, positioned wherever equipment requires periodic removal."),
]

NIPPLES = [
    ("Pipe Nipple (NBPL x NBPL)", "Plain bevel end nipple for welded connections at both ends.",
     "A pipe nipple with plain bevelled ends at both extremities is prepared for butt welding into a pipe run, providing a short length of pipe with correctly machined weld preparations."),
    ("Pipe Nipple (NBPL x NPTM)", "Nipple with one bevel weld end and one male NPT thread.",
     "This nipple transitions from a welded connection at one end to a male NPT thread at the other, bridging welded and threaded sections of a system."),
    ("Pipe Nipple (NPTM x NPTM)", "Nipple with male NPT threads at both ends.",
     "A double male NPT nipple connects two female-threaded ports, available in close, short and long lengths to suit the required separation."),
    ("Swage Nipple (NBPL x NBPL)", "Concentric swage nipple with plain bevel ends both sides.",
     "A swage nipple reduces pipe size over a short tapered length while presenting bevelled weld ends at both extremities. Concentric and eccentric forms are available."),
    ("Swage Nipple (NBPL x NPTM)", "Swage nipple with a bevel weld end and a male NPT end.",
     "This swage nipple both reduces pipe size and transitions from a welded to a threaded connection in a single component."),
    ("Swage Nipple (NPTM x NPTM)", "Swage nipple with male NPT threads at both ends.",
     "A threaded swage nipple reduces pipe size between two female-threaded ports without any welding."),
]

pipe_fittings = category(
    "Pipe Fittings",
    "Instrument pipe fittings, forged socket weld and threaded fittings, and pipe nipples in stainless steel and carbon steel for pressure classes to 9000#.",
    [
        category("Instrument Pipe Fittings", "Machined NPT nipples, adaptors, bushings, couplings, elbows, tees and crosses for instrument hook-ups.",
                 [product(t, s, l, specs(PIPE_FITTING_SPECS), APPS_INSTRUMENT) for t, s, l in INSTRUMENT_PIPE]),
        category("Socket Welded Forged Fittings", "Forged elbows, tees, crosses, couplings and unions to ASME B16.11 in 3000#, 6000# and 9000# classes.",
                 [product(t, s, l, specs(SOCKET_WELD_SPECS), APPS_PROCESS) for t, s, l in SOCKET_WELD]),
        category("Threaded Fittings", "Forged threaded elbows, tees, crosses, couplings and unions for weld-free pipe assembly.",
                 [product(t, s, l, specs(THREADED_FITTING_SPECS), APPS_PROCESS) for t, s, l in THREADED_FITTINGS]),
        category("Nipples", "Pipe and swage nipples with bevel weld and male NPT ends in a range of schedules and lengths.",
                 [product(t, s, l, specs(NIPPLE_SPECS), APPS_PROCESS) for t, s, l in NIPPLES]),
    ],
)


# ==========================================================================
# 3. VALVES
# ==========================================================================

NEEDLE_VALVES = [
    ("Needle Valve (F x F)", "Straight-pattern needle valve with female threads both ends.",
     "A needle valve uses a finely tapered stem seating into a matched orifice, so stem rotation produces a small, controlled change in flow area. That makes it the standard device for throttling, isolating and calibrating instrument impulse lines where precise regulation matters more than flow capacity. This configuration presents female threads at both inlet and outlet."),
    ("Needle Valve (M x F)", "Straight needle valve with male inlet and female outlet.",
     "A male-by-female needle valve screws directly into a process port at the inlet while presenting a female thread at the outlet, removing the need for a separate adaptor and shortening the hook-up."),
    ("Needle Valve (M x M)", "Straight needle valve with male threads at both ends.",
     "A double-male needle valve connects directly between two female-ported components, giving the most compact possible installation between a process tapping and an instrument."),
    ("Needle Valve – Angle Type (F x F)", "90° angle-pattern needle valve, female both ends.",
     "An angle-pattern needle valve turns the flow path through 90° within the valve body, combining direction change with throttling. This saves a separate elbow and reduces the joint count in a hook-up."),
    ("Needle Valve – Angle Type (M x F)", "90° angle needle valve with male inlet, female outlet.",
     "This angle valve mounts directly onto a process tapping via its male inlet and turns the flow 90° to a female outlet, a common arrangement for gauge take-offs from vertical lines."),
    ("Needle Valve – Angle Type (M x M)", "90° angle needle valve with male threads at both ends.",
     "A double-male angle valve provides a 90° throttled connection directly between two female-ported components."),
    ("Needle Valve (Tube OD)", "Needle valve with twin-ferrule tube connections.",
     "This needle valve terminates in twin-ferrule tube fittings rather than pipe threads, allowing it to be installed directly inline in a tube run without any thread-to-tube transition fittings."),
    ("Needle Valve (M x F) with Vent Plug", "Needle valve incorporating an integral vent connection.",
     "A vent plug built into the valve body allows trapped pressure downstream of the seat to be safely released before an instrument is removed, an important safety feature when servicing live systems."),
    ("Needle Valve (M x F) with Drain Plug", "Needle valve incorporating an integral drain connection.",
     "An integral drain plug lets accumulated liquid or condensate be removed from the impulse line without dismantling the hook-up, useful on steam and wet gas service."),
    ("Needle Valve – Male Inlet x 3", "Multi-port needle valve with three male connections.",
     "This multi-port configuration provides three male connections from a single valve body, allowing an isolation point to serve several take-offs and reducing the overall component count in a hook-up."),
]

BALL_VALVES = [
    ("Ball Valve", "Quarter-turn ball valve for rapid on/off isolation.",
     "A ball valve uses a drilled sphere rotated through 90° to move between fully open and fully closed. It provides fast, positive shut-off with minimal pressure drop when open, and the handle position gives an unambiguous visual indication of valve state."),
    ("2 Way Ball Valve", "Two-port ball valve for straightforward inline isolation.",
     "A two-way ball valve provides simple inline isolation with a single flow path, the most common configuration for shutting off an instrument line or branch."),
    ("3 Way Ball Valve", "Three-port ball valve for diverting or mixing flow.",
     "A three-way ball valve uses an L-port or T-port ball to divert flow between two outlets, or to combine two inlets. It is used for switching between duty and standby instruments without breaking the line."),
    ("5 Way Ball Valve (OD Type)", "Five-port ball valve with tube OD connections.",
     "A five-port ball valve consolidates multiple isolation and equalisation functions into a single body with twin-ferrule tube connections, reducing the number of separate components in a complex hook-up."),
    ("3 Piece Ball Valve", "Three-piece body ball valve permitting in-line servicing.",
     "A three-piece design allows the centre body section to be removed for seat and seal replacement while the end connections stay welded or threaded into the pipework, so the valve can be serviced without disturbing the surrounding piping."),
]

GATE_VALVES = [
    ("Gate Valve 800#", "Forged gate valve rated to 800 pressure class.",
     "A gate valve raises a wedge clear of the flow path, giving a straight-through bore and very low pressure drop when fully open. It is intended for isolation duty — fully open or fully closed — rather than throttling. The 800# class suits general process isolation."),
    ("Gate Valve 1500#", "Forged gate valve rated to 1500 pressure class.",
     "Rated for higher pressure service, the 1500# gate valve carries a heavier body and bonnet section for elevated-pressure isolation duty in refinery and power applications."),
    ("Gate Valve 2500#", "Forged gate valve rated to 2500 pressure class.",
     "The 2500# class provides the highest standard pressure rating in this range, for severe-service isolation on high-pressure steam, hydrocarbon and hydraulic systems."),
]

GLOBE_VALVES = [
    ("Globe Valve 800#", "Forged globe valve rated to 800 pressure class.",
     "A globe valve seats a plug against a horizontal seat ring, forcing the flow to change direction through the body. That geometry gives it far better throttling characteristics than a gate valve, at the cost of higher pressure drop. The 800# class suits general regulating duty."),
    ("Globe Valve 1500#", "Forged globe valve rated to 1500 pressure class.",
     "The 1500# globe valve provides controlled throttling and positive shut-off at elevated pressures, with a reinforced body and bonnet."),
    ("Globe Valve 2500#", "Forged globe valve rated to 2500 pressure class.",
     "The 2500# class delivers the highest standard pressure rating in the range for severe-service regulating and isolation duty."),
]

valves = category(
    "Valves",
    "Needle, ball, gate and globe valves in stainless steel and exotic alloys for isolation, throttling and shut-off duty up to 6,000 psi and 2500 pressure class.",
    [
        category("Needle Valves", "Straight and angle pattern needle valves for precise throttling and isolation of instrument lines.",
                 [product(t, s, l, specs(NEEDLE_VALVE_SPECS)) for t, s, l in NEEDLE_VALVES]),
        category("Ball Valves", "Quarter-turn 2-way, 3-way, 5-way and three-piece ball valves for rapid isolation and diversion.",
                 [product(t, s, l, specs(BALL_VALVE_SPECS)) for t, s, l in BALL_VALVES]),
        category("Gate Valves", "Forged OS&Y gate valves in 800#, 1500# and 2500# classes for full-bore isolation duty.",
                 [product(t, s, l, specs(GATE_VALVE_SPECS), APPS_PROCESS) for t, s, l in GATE_VALVES]),
        category("Globe Valves", "Forged globe valves in 800#, 1500# and 2500# classes for regulating and shut-off duty.",
                 [product(t, s, l, specs(GLOBE_VALVE_SPECS), APPS_PROCESS) for t, s, l in GLOBE_VALVES]),
    ],
)


# ==========================================================================
# 4. CHECK, RELIEF & QUICK-RELEASE
# ==========================================================================

NRV_ITEMS = [
    ("Non-Return Valves", "Spring-loaded check valve permitting flow in one direction only.",
     "A non-return valve allows flow in one direction and closes automatically if the differential reverses, protecting pumps, compressors and instruments from backflow damage. A calibrated spring sets the cracking pressure at which the poppet lifts, and the valve reseats without any external actuation."),
    ("Pressure Relief Valves", "Adjustable relief valve protecting systems from overpressure.",
     "A pressure relief valve opens at a preset pressure to discharge excess system pressure, then reseats once conditions return to normal. The set point is adjustable across the spring range, and the valve provides an essential last line of defence against overpressure damage to vessels and instruments."),
    ("Quick Release Couplings", "Push-to-connect coupling for rapid, tool-free line connection.",
     "A quick release coupling lets a line be connected and disconnected by hand without tools. Integral check valves in both halves close automatically on disconnection, so the line does not drain and fluid loss is minimal — the standard choice for test rigs, calibration equipment and temporary air or hydraulic connections."),
]

nrv = category(
    "Check, Relief & Quick Release Valves",
    "Non-return valves, adjustable pressure relief valves and quick release couplings for backflow prevention, overpressure protection and rapid line connection.",
    [product(t, s, l, specs(CHECK_RELIEF_SPECS)) for t, s, l in NRV_ITEMS],
    slug="check-relief-quick-release-valves",
)


# ==========================================================================
# 5. MANIFOLD VALVES
# ==========================================================================

def manifold(code, ways, desc_extra):
    return (
        code,
        f"{ways}-way instrumentation manifold, configuration {code}.",
        f"A {ways}-way manifold consolidates the isolation, equalisation and venting functions of an instrument hook-up into a single forged body, replacing an assembly of separate valves and fittings. Fewer joints means fewer potential leak paths and a considerably faster installation. {desc_extra} Configuration {code} defines the specific port arrangement and mounting pattern; full dimensional drawings are available on request.",
    )


TWO_WAY = [
    manifold("2M-01", 2, "A 2-way manifold provides a block valve and a test or drain port, used with gauge and single-sided pressure instruments."),
    manifold("2M-02", 2, "This arrangement suits direct gauge mounting where a single isolation point and a vent are required."),
    manifold("2M-03", 2, "Configured for remote mounting where the instrument sits away from the process tapping."),
    manifold("2M-04", 2, "Suited to applications requiring an additional calibration connection alongside isolation."),
    manifold("2M-05", 2, "A compact variant for installations with restricted clearance around the instrument."),
]

THREE_WAY = [
    manifold("3M-01", 3, "A 3-way manifold provides two block valves plus an equalising valve, the standard arrangement for differential pressure transmitters. The equalising valve lets both sides be brought to equal pressure so the transmitter can be zeroed without removal."),
    manifold("3M-02", 3, "Direct-mount configuration flanging straight onto the transmitter body."),
    manifold("3M-03", 3, "Remote-mount arrangement for transmitters installed away from the process tapping."),
    manifold("3M-04", 3, "Includes additional vent connections for draining and venting the impulse legs."),
    manifold("3M-05", 3, "A compact pattern for installations with limited space around the transmitter."),
]

FIVE_WAY = [
    manifold("5M-01", 5, "A 5-way manifold adds two vent or test connections to the standard two-block-plus-equalise arrangement, allowing full calibration and drain-down of both impulse legs without breaking any joint."),
    manifold("5M-02", 5, "An alternative 5-way port arrangement for transmitters requiring separate high and low side test connections."),
]

manifolds = category(
    "Manifold Valves",
    "Two, three and five way instrumentation manifolds that combine isolation, equalisation and venting into a single forged body for gauge and transmitter hook-ups.",
    [
        category("2 Way Manifold Valves", "Block-and-bleed manifolds for pressure gauges and single-sided instruments.",
                 [product(t, s, l, specs(MANIFOLD_SPECS)) for t, s, l in TWO_WAY]),
        category("3 Way Manifold Valves", "Two-block-plus-equalise manifolds for differential pressure transmitters.",
                 [product(t, s, l, specs(MANIFOLD_SPECS)) for t, s, l in THREE_WAY]),
        category("5 Way Manifold Valves", "Manifolds adding vent and test connections for full in-situ calibration.",
                 [product(t, s, l, specs(MANIFOLD_SPECS)) for t, s, l in FIVE_WAY]),
    ],
)


# ==========================================================================
# 6-9. HARDWARE, SAMPLING, FLANGES, TUBES
# ==========================================================================

HARDWARE_ITEMS = [
    ("Air Headers", "Multi-outlet distribution header for instrument air supply.",
     "An air header distributes a single instrument air supply to multiple downstream users from one manifold body. Each outlet carries its own isolation valve so individual instruments can be taken off line without interrupting the others. Headers are supplied in 4, 6, 8, 10 and 12 outlet configurations with an integral drain and mounting brackets."),
    ("Condensate Pots", "Chamber that maintains a stable liquid seal in impulse lines.",
     "A condensate pot maintains a constant liquid level in the impulse legs of a differential pressure measurement, so that the head of liquid acting on the transmitter stays stable as the process fluctuates. It is essential for accurate steam flow and level measurement, where condensate would otherwise accumulate unevenly and introduce measurement error."),
    ("Syphons", "Pigtail or coil syphon protecting instruments from hot media.",
     "A syphon traps a small volume of condensate between the process and the instrument, so that hot steam or gas never reaches the pressure element directly. This protects the gauge or transmitter from thermal damage and extends its service life. Pigtail and coil forms are available to suit the mounting orientation."),
]

hardware = category(
    "Instrumentation Hardware",
    "Air headers, condensate pots and syphons that support and protect field instruments in steam, air and process measurement systems.",
    [product(t, s, l, specs(HARDWARE_SPECS), APPS_PROCESS) for t, s, l in HARDWARE_ITEMS],
)

SAMPLING_ITEMS = [
    ("Sampling Bombs", "Pressure-rated cylinder for capturing and transporting fluid samples.",
     "A sampling bomb is a pressure-rated cylinder used to draw a representative sample of a process fluid and transport it to the laboratory without loss of light ends or contamination. Needle valves at both ends allow the sample to be isolated at process pressure, and options include rupture discs, purge valves and protective carrying cages."),
]

sampling = category(
    "Sampling Bombs",
    "Pressure-rated sample cylinders in stainless steel and exotic alloys for representative sampling of process fluids and laboratory transport.",
    [product(t, s, l, specs(SAMPLING_SPECS)) for t, s, l in SAMPLING_ITEMS],
)

FLANGE_ITEMS = [
    ("Blind Flange (BLRF)", "Solid raised-face flange used to seal off a pipe end or nozzle.",
     "A blind flange closes off the end of a pipe run, a vessel nozzle or a valve opening. Because it carries the full system pressure across its whole face, it is one of the more highly stressed flange types and is commonly used where a future connection is planned or where a line must be isolated for testing."),
    ("Lap Joint Flange", "Two-part flange assembly used with a stub end for easy alignment.",
     "A lap joint flange sits loose over a stub end welded to the pipe, so the flange can be rotated freely to align bolt holes during assembly. Because it never contacts the process fluid, the flange itself can be made in a lower-grade material than the pipe, which offers a meaningful cost saving in alloy systems."),
    ("Slip-On Raised Face Flange (SORF)", "Flange that slips over the pipe and is fillet welded inside and out.",
     "A slip-on flange slides over the pipe end and is welded on both the inside and outside, making it more tolerant of cutting-length error than a weld neck flange and simpler to align. It is widely used in lower-pressure service where the reduced fatigue strength is acceptable."),
    ("Socket Weld Raised Face Flange (SWRF)", "Flange with an internal socket for small-bore pipe.",
     "A socket weld flange receives the pipe into a machined internal socket and is fillet welded externally, giving a strong joint on small-bore high-pressure lines without the need for internal welding access."),
    ("Threaded Flange", "Flange with a female pipe thread for weld-free assembly.",
     "A threaded flange screws onto a male-threaded pipe end, allowing a flanged connection to be made without any welding. It is the usual choice where hot work is prohibited, such as in flammable atmospheres or on existing live plant."),
    ("Weld Neck Raised Face Flange (WNRF)", "Flange with a tapered hub butt welded to the pipe.",
     "A weld neck flange has a long tapered hub that is butt welded to the pipe, transferring stress smoothly from the flange into the pipe wall. This gives it the highest fatigue strength of any flange type, which is why it dominates high-pressure, high-temperature and cyclic service."),
]

flanges = category(
    "Flanges",
    "Blind, lap joint, slip-on, socket weld, threaded and weld neck flanges to ASME B16.5 in classes from 150# to 2500#.",
    [product(t, s, l, specs(FLANGE_SPECS), APPS_PROCESS) for t, s, l in FLANGE_ITEMS],
)

TUBE_ITEMS = [
    ("Imperial Tubing", "Seamless instrumentation tubing in imperial outside diameters.",
     "Imperial instrumentation tubing is supplied fully annealed with a bright annealed surface finish, in outside diameters from 1/16\" to 1\". Hardness is controlled to a maximum of 80 HRB, which matters because tubing that is harder than the ferrule will not allow the ferrule to bite correctly and the joint will leak. Supplied with mill test certificates traceable to heat number."),
    ("Metric Tubing", "Seamless instrumentation tubing in metric outside diameters.",
     "Metric instrumentation tubing covers outside diameters from 3 mm to 25 mm in the same fully annealed condition and controlled hardness as the imperial range. It should always be paired with metric-dimensioned ferrules, as mixing imperial and metric components is a common cause of joint failure."),
]

tubes = category(
    "Tubes",
    "Seamless and welded instrumentation tubing to ASTM A269 and A213 in imperial and metric sizes, fully annealed with controlled hardness for reliable ferrule sealing.",
    [product(t, s, l, specs(TUBING_SPECS)) for t, s, l in TUBE_ITEMS],
)


# ==========================================================================
# MERGE INTO masterContent.json
# ==========================================================================

ENGINEERING_CHILDREN = [
    tube_fittings,
    pipe_fittings,
    valves,
    nrv,
    manifolds,
    hardware,
    sampling,
    flanges,
    tubes,
]

ENGINEERING_DESCRIPTION = (
    "Precision instrumentation fittings, valves, manifolds and flanges for process control, "
    "oil and gas, power generation and chemical plant. Supplied in stainless steel, carbon steel "
    "and exotic alloys with full material traceability and export documentation."
)


def count_products(nodes):
    n = 0
    for x in nodes:
        if x["type"] == "product":
            n += 1
        else:
            n += count_products(x.get("children", []))
    return n


def main():
    with open(DATA, "r", encoding="utf-8") as f:
        content = json.load(f)

    target = None
    for cat in content.get("categories", []):
        if cat.get("slug") == "engineering-products":
            target = cat
            break

    if target is None:
        target = {
            "type": "category",
            "id": nid(),
            "title": "Engineering Products",
            "slug": "engineering-products",
            "children": [],
        }
        content.setdefault("categories", []).append(target)

    target["description"] = ENGINEERING_DESCRIPTION
    target["children"] = ENGINEERING_CHILDREN

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print("Engineering Products rebuilt.")
    print(f"  Top-level sub-categories : {len(ENGINEERING_CHILDREN)}")
    total_sub = sum(len([c for c in x['children'] if c['type'] == 'category']) for x in ENGINEERING_CHILDREN)
    print(f"  Nested sub-categories    : {total_sub}")
    print(f"  Total products           : {count_products(ENGINEERING_CHILDREN)}")
    for c in ENGINEERING_CHILDREN:
        print(f"    - {c['title']:<38} {count_products(c['children']):>3} products")


if __name__ == "__main__":
    main()
