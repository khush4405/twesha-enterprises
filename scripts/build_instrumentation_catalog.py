#!/usr/bin/env python3
"""
Populate the "Instrumentation Products" category with SEVEN broad products.

Same pattern as Hose Pipes: each broad category becomes ONE product card, with
its individual types folded into the long description and into the spec table
as a comma-separated summary row plus one row each. Seven images needed.

Editable in Admin -> Catalog -> Instrumentation Products.
"""

import json, os, re, itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "masterContent.json")

_ids = itertools.count(1798000000000)


def nid():
    return str(next(_ids))


def slugify(text):
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def apps(items):
    return [{"title": t, "desc": d} for t, d in items]


def build_specs(base, range_label, variants):
    rows = [{"label": l, "value": v} for l, v in base]
    rows.append({"label": range_label, "value": ", ".join(n for n, _ in variants)})
    rows.extend({"label": n, "value": d} for n, d in variants)
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

APPS_PROCESS = [
    ("Pharmaceutical", "Clean utilities, reactor monitoring and validated process lines."),
    ("Chemical & Petrochemical", "Corrosive media measurement and hazardous area installations."),
    ("Oil & Gas", "Custody transfer, wellhead monitoring and refinery process control."),
    ("Power Generation", "Boiler feedwater, steam metering and turbine auxiliary systems."),
]

APPS_UTILITY = [
    ("Water & Wastewater", "Treatment plants, distribution networks and effluent monitoring."),
    ("Chemical Processing", "Batch dosing, reactor charging and transfer measurement."),
    ("Food & Beverage", "Hygienic process lines, CIP systems and utility metering."),
    ("Textiles & Dyeing", "Dye dosing, water consumption and process temperature control."),
]

APPS_AUTOMATION = [
    ("Factory Automation", "Control panel builds, machine control and production line integration."),
    ("Process Plants", "DCS and PLC cabinets, remote I/O stations and marshalling panels."),
    ("Power Distribution", "Substation control, energy monitoring and protection systems."),
    ("Infrastructure", "Water utilities, building management and transport systems."),
]

# --------------------------------------------------------------------------
# 1. Automation Products
# --------------------------------------------------------------------------

AUTOMATION_BASE = [
    ("Product Scope", "Power supplies, controllers, I/O, HMI, networking, terminals and cabling"),
    ("Programming Standard", "IEC 61131-3 compliant controller programming"),
    ("Protection Ratings", "IP20 for cabinet mounting; IP65 and IP67 for field-mounted I/O"),
    ("Mounting", "DIN rail, panel and rack mounting options"),
    ("Supply Voltage", "24 V DC standard; 110-230 V AC input on power supplies"),
    ("Communication", "Industrial Ethernet, PROFINET, Modbus TCP/RTU, IO-Link"),
    ("Operating Temperature", "-25 C to +60 C, product dependent"),
    ("Certification", "CE, UL and ATEX/IECEx variants available"),
]

AUTOMATION_VARIANTS = [
    ("Power Supplies", "DIN rail, panel and rack-mount supplies with wide input range and redundancy options."),
    ("PLCs and Remote I/O", "Industrial controllers and distributed I/O in IP20, IP65 and IP67, programmed to IEC 61131-3."),
    ("Open Automation Platforms", "Modular open-ecosystem controllers supporting third-party software and containerised applications."),
    ("Distribution and Device Terminal Blocks", "Ready-to-connect distribution blocks for space-saving, expandable cabinet wiring."),
    ("HMI Panels and Industrial PCs", "Operator panels and industrial PCs for visualisation, monitoring and machine control."),
    ("Terminal Blocks", "Screw, spring-cage and push-in terminals with bridging accessories for control wiring."),
    ("Industrial Ethernet Switches", "Managed and unmanaged switches with Gigabit, PoE and ring redundancy for harsh environments."),
    ("Cables and Connectors", "Sensor/actuator cables, data and power lines, and industrial circular connectors."),
]

automation = product(
    "Automation Products",
    "Control panel automation hardware - power supplies, PLCs, I/O, HMI, networking and terminals.",
    "A complete hardware set for building and integrating industrial control systems, covering everything from the incoming supply to the operator interface.\n\n"
    "Eight product groups are available: Power Supplies, PLCs and Remote I/O, Open Automation Platforms, Distribution and Device Terminal Blocks, HMI Panels and Industrial PCs, Terminal Blocks, Industrial Ethernet Switches, and Cables and Connectors.\n\n"
    "Controllers are programmed to IEC 61131-3, so logic developed on one platform transfers to another without a rewrite. Remote I/O is offered in IP20 for cabinet mounting and IP65/IP67 for direct field installation, which removes long sensor home-runs and cuts wiring cost substantially on distributed plant.\n\n"
    "Networking hardware is specified for industrial rather than office conditions: extended temperature range, redundant ring topologies that recover in milliseconds, and DIN rail mounting. Terminal and distribution blocks use push-in or spring-cage technology, which speeds up panel building and removes the re-torquing maintenance that screw terminals require.",
    build_specs(AUTOMATION_BASE, "Product Groups", AUTOMATION_VARIANTS),
    APPS_AUTOMATION,
)

# --------------------------------------------------------------------------
# 2. Flow Measurement
# --------------------------------------------------------------------------

FLOW_BASE = [
    ("Measurement Principles", "Positive displacement, vortex shedding, turbine, electromagnetic, thermal mass and Coriolis"),
    ("Line Size Range", "DN 6 to DN 600, technology dependent"),
    ("Accuracy", "±0.1% to ±1.5% of reading, depending on principle and application"),
    ("Wetted Materials", "SS 304 / SS 316 / SS 316L, PTFE, PP, Hastelloy and ceramic liners"),
    ("Process Temperature", "-40 C to +350 C, technology dependent"),
    ("Process Pressure", "Up to 100 bar, size and type dependent"),
    ("Output Signals", "4-20 mA, pulse, Modbus RTU/TCP, HART, relay and totaliser outputs"),
    ("Display", "Local LCD with instantaneous rate and cumulative totaliser"),
    ("Enclosure", "IP65 / IP67; flameproof and intrinsically safe versions available"),
    ("Calibration", "Factory flow-calibrated with traceable certificate"),
]

FLOW_VARIANTS = [
    ("Oval Gear Flow Meter", "Positive displacement measurement for viscous liquids such as oils, resins and syrups, unaffected by viscosity changes."),
    ("Vortex Flow Meter", "Measures steam, gas and liquid by shedding frequency; no moving parts and excellent long-term stability."),
    ("Turbine Flow Meter", "High-accuracy measurement of clean, low-viscosity liquids using a rotor whose speed is proportional to flow."),
    ("Electromagnetic Flow Meter", "Obstruction-free measurement of conductive liquids including slurries and effluent, with zero pressure drop."),
    ("Helical Rotor Flow Meter", "Positive displacement measurement for high-viscosity fluids where other technologies lose accuracy."),
    ("Swirl Flow Meter", "Dual-sensor design for air and gas with built-in pressure and temperature compensation."),
    ("Thermal Mass Flow Meter", "Direct mass flow sensing for air and gas without separate pressure and temperature correction."),
    ("Coriolis Mass Flow Meter", "Simultaneous direct measurement of mass flow, density and temperature at the highest accuracy class."),
    ("Fuel Consumption Meter", "Dual-sensor supply and return measurement for accurate diesel engine and generator fuel monitoring."),
    ("Plastic Helical Flow Sensor & Meter", "Corrosion-resistant sensors and digital meters for water and chemical dosing lines."),
    ("Flow Switches", "Simple on/off flow detection for pump protection, cooling circuits and low-flow alarms."),
]

flow = product(
    "Flow Measurement",
    "Complete flow metering range covering liquids, gases and steam across eleven technologies.",
    "Flow measurement covers eleven distinct technologies, because no single principle handles every fluid well. Selecting correctly is largely a question of matching the physics to the medium.\n\n"
    "Available types: Oval Gear Flow Meter, Vortex Flow Meter, Turbine Flow Meter, Electromagnetic Flow Meter, Helical Rotor Flow Meter, Swirl Flow Meter, Thermal Mass Flow Meter, Coriolis Mass Flow Meter, Fuel Consumption Meter, Plastic Helical Flow Sensor & Meter, and Flow Switches.\n\n"
    "For conductive liquids including dirty water, slurries and effluent, an electromagnetic meter is usually the right answer: it has no obstruction in the bore, so there is no pressure drop and nothing to clog or wear. For viscous fluids such as oils and resins, positive displacement types (oval gear, helical rotor) hold accuracy where turbine and vortex meters degrade. Steam and gas are typically handled by vortex or thermal mass, the latter measuring mass directly and so removing the need for separate pressure and temperature compensation.\n\n"
    "Where the highest accuracy is required, or where density and mass are needed alongside volume, Coriolis measures all three directly. Every meter is factory flow-calibrated and supplied with a traceable certificate.",
    build_specs(FLOW_BASE, "Available Types", FLOW_VARIANTS),
    APPS_UTILITY,
)

# --------------------------------------------------------------------------
# 3. Level Measurement
# --------------------------------------------------------------------------

LEVEL_BASE = [
    ("Measurement Principles", "Guided wave and non-contact radar, ultrasonic, hydrostatic, float, capacitance and vibrating fork"),
    ("Measuring Range", "Up to 30 m depending on technology"),
    ("Accuracy", "±2 mm to ±0.5% of span, technology dependent"),
    ("Wetted Materials", "SS 316 / SS 316L, PTFE, PP and Hastelloy"),
    ("Process Temperature", "-40 C to +250 C, technology dependent"),
    ("Process Pressure", "Vacuum to 40 bar"),
    ("Output Signals", "4-20 mA with HART, Modbus RTU, relay contacts for switches"),
    ("Enclosure", "IP66 / IP67; flameproof and intrinsically safe versions available"),
    ("Mounting", "Flanged, threaded, sanitary tri-clamp and top or side entry"),
]

LEVEL_VARIANTS = [
    ("Level Transmitters", "Continuous level measurement by radar, ultrasonic, hydrostatic or capacitance, giving an analogue reading of tank contents."),
    ("Level Switches", "Point-level detection for high and low alarms, pump control and dry-run protection using float, vibrating fork or capacitance sensing."),
    ("Ultrasonic Level Measurement", "Non-contact continuous measurement using time-of-flight, suited to open channels, sumps and aggressive liquids where nothing should touch the medium."),
]

level = product(
    "Level Measurement",
    "Continuous level transmitters, point-level switches and non-contact ultrasonic measurement.",
    "Level instrumentation divides into two distinct jobs, and confusing them is a common specification error. Continuous measurement reports how much is in the vessel at any moment; point-level detection simply reports whether the medium is present at one specific height.\n\n"
    "Three groups are available: Level Transmitters, Level Switches and Ultrasonic Level Measurement.\n\n"
    "Transmitters give an analogue reading across the full tank range and are used for inventory management, batch control and closed-loop regulation. Switches are simpler and considerably cheaper, and are the correct choice for high and low alarms, pump start/stop control and dry-run protection, where an analogue value would be redundant.\n\n"
    "Ultrasonic measurement is non-contact, working by time-of-flight from a transducer above the surface. Because nothing touches the medium it suits aggressive chemicals, sludge and open channels, though it needs care where heavy vapour, foam or dust would attenuate the signal. Where those conditions exist, guided wave radar is generally the better answer.",
    build_specs(LEVEL_BASE, "Available Types", LEVEL_VARIANTS),
    APPS_UTILITY,
)

# --------------------------------------------------------------------------
# 4. Heating Solution & Temperature Measurement
# --------------------------------------------------------------------------

TEMP_BASE = [
    ("Sensor Types", "RTD (Pt100 / Pt1000) and thermocouple (K, J, T, R, S, B)"),
    ("Temperature Range", "-200 C to +1600 C, sensor type dependent"),
    ("Accuracy Class", "Class A / Class AA to IEC 60751 for RTDs"),
    ("Sheath Materials", "SS 316 / SS 310 / Inconel 600 / ceramic"),
    ("Process Connections", "Threaded, flanged, sanitary and compression fittings with thermowells"),
    ("Output Signals", "Direct sensor, 4-20 mA head transmitter, HART and Modbus RTU"),
    ("Hazardous Area", "Flameproof (Ex d) and intrinsically safe (Ex ia) versions available"),
    ("Control Instruments", "PID controllers, indicators, scanners, data loggers and recorders"),
    ("Calibration", "Factory calibrated with traceable certificate"),
]

TEMP_VARIANTS = [
    ("Process Heating Solution", "Engineered heating systems for tanks, pipelines and process vessels including thermic fluid circuits."),
    ("Temperature Sensors", "RTD and thermocouple assemblies with thermowells for process temperature measurement."),
    ("Process Control Instruments", "PID controllers, digital indicators, multi-channel scanners and data loggers."),
    ("Flow & Level Indicator", "Local and panel-mount indicators displaying flow rate, totals and tank level."),
    ("Flame Proof Instruments", "Ex d certified sensors, transmitters and enclosures for hazardous area installation."),
    ("Electrical Oven", "Industrial ovens for drying, curing and heat treatment with uniform temperature distribution."),
    ("Electrical Furnace", "High-temperature furnaces for annealing, hardening and laboratory applications."),
]

temperature = product(
    "Heating Solution & Temperature Measurement",
    "Temperature sensors, process control instruments, flameproof instrumentation and industrial heating equipment.",
    "This range covers both the measurement of process temperature and the equipment that generates and controls it.\n\n"
    "Seven groups are available: Process Heating Solution, Temperature Sensors, Process Control Instruments, Flow & Level Indicator, Flame Proof Instruments, Electrical Oven and Electrical Furnace.\n\n"
    "On the measurement side, the primary choice is between RTD and thermocouple. RTDs (Pt100, Pt1000) are more accurate and more stable over time, and are the default below roughly 600 C. Thermocouples cover a far wider range, respond faster and cost less, which makes them the practical choice for furnace and high-temperature duty. Both are normally installed in a thermowell so the sensor can be replaced without breaking process containment.\n\n"
    "Head-mounted transmitters convert the sensor output to 4-20 mA at the point of measurement, which matters because raw millivolt and resistance signals degrade over long cable runs. For hazardous areas, flameproof and intrinsically safe variants are available with the appropriate certification.",
    build_specs(TEMP_BASE, "Available Types", TEMP_VARIANTS),
    APPS_PROCESS,
)

# --------------------------------------------------------------------------
# 5. Pressure Gauges & Transmitters
# --------------------------------------------------------------------------

PRESSURE_BASE = [
    ("Dial Sizes", "40, 50, 63, 100, 150 and 250 mm"),
    ("Measuring Ranges", "Vacuum -1 bar to 1000 bar; low-range capsule from 0-2.5 mbar"),
    ("Accuracy Class", "±0.25% to ±1.6% of full scale, type dependent"),
    ("Wetted Materials", "SS 316 / SS 316L, Monel, Hastelloy, tantalum and PTFE-lined"),
    ("Case Material", "SS 304 / SS 316 weatherproof cases; glycerine filled options"),
    ("Process Connections", "1/4 inch, 1/2 inch NPT/BSP, flanged and sanitary tri-clamp"),
    ("Protection Rating", "IP65 standard; IP67 on filled and electronic versions"),
    ("Transmitter Output", "4-20 mA two-wire with HART, 0-10 V, Modbus RTU"),
    ("Standards", "Manufactured to EN 837-1 / ASME B40.100"),
    ("Calibration", "Individually calibrated with traceable test certificate"),
]

PRESSURE_VARIANTS = [
    ("Bourdon Type", "The standard industrial mechanical gauge, covering heavy duty, test/master, electric contact, economical, safety pattern and utility variants."),
    ("Diaphragm Operated Type", "For low pressures and viscous or crystallising media; includes Schaffer, compact seal, sanitary and homogenizer patterns."),
    ("Capsule Operated Type", "Very low pressure and draught measurement in millibar ranges, including compact capsule gauges."),
    ("Chemical Seal", "Diaphragm seal assemblies isolating the gauge from corrosive, hot or clogging media; includes compact diaphragm sealed and maximum reading pointer types."),
    ("Pressure Transmitters", "Electronic transmitters and digital gauges giving 4-20 mA, HART or Modbus output for remote monitoring and control."),
]

pressure = product(
    "Pressure Gauges & Transmitters",
    "Mechanical pressure gauges and electronic transmitters across bourdon, diaphragm, capsule and sealed types.",
    "Pressure instrumentation spans simple mechanical indication through to electronic transmission, and the sensing element determines what each type can handle.\n\n"
    "Five groups are available: Bourdon Type, Diaphragm Operated Type, Capsule Operated Type, Chemical Seal and Pressure Transmitters.\n\n"
    "A bourdon tube is the workhorse of industrial pressure measurement, covering roughly 0.6 bar upward with good accuracy and low cost. Below that its sensitivity falls away, which is where a diaphragm element takes over — and a diaphragm also copes far better with viscous, crystallising or particle-laden media that would block a bourdon tube's narrow bore. For very low pressures and draught measurement in millibar ranges, a capsule element is required.\n\n"
    "Chemical seals isolate the element entirely behind a flush diaphragm, with the intervening space filled by a transmission fluid. This is what allows a standard gauge to be used on corrosive acids, molten polymers or media that would otherwise attack or clog it. Electronic transmitters convert pressure to 4-20 mA or a digital protocol for control system integration.",
    build_specs(PRESSURE_BASE, "Available Types", PRESSURE_VARIANTS),
    APPS_PROCESS,
)

# --------------------------------------------------------------------------
# 6. Analytical Instruments & Pneumatic Products
# --------------------------------------------------------------------------

ANALYTICAL_BASE = [
    ("Parameters Measured", "pH, ORP, conductivity, TDS, salinity and resistivity"),
    ("pH Range", "0 to 14 pH with ±0.02 pH resolution"),
    ("ORP Range", "-2000 to +2000 mV"),
    ("Conductivity Range", "0.055 µS/cm to 200 mS/cm across cell constants"),
    ("Temperature Compensation", "Automatic, via integral Pt1000 sensor"),
    ("Output & Communication", "4-20 mA, RS485 Modbus RTU, relay contacts"),
    ("Electrode Body", "Glass, PPS or PTFE with process-compatible junctions"),
    ("Protection Rating", "IP65 / IP68 sensors; IP65 panel and field instruments"),
    ("Mounting", "Submersion, insertion, flow-through and panel mount"),
    ("Calibration", "Field-calibratable against standard buffer solutions"),
]

ANALYTICAL_VARIANTS = [
    ("Digital pH Sensor (Modbus RS485)", "Networked digital pH sensor with on-board temperature compensation and direct Modbus RS485 output for IoT and SCADA integration."),
    ("Conductivity / TDS / Salinity / Resistivity Meter", "Multi-parameter water quality analyser measuring conductivity and its derived values from a single sensor."),
    ("pH / ORP Analyzer", "Combined pH and redox potential analyser with dual relay control outputs for dosing and alarm duty."),
]

analytical = product(
    "Analytical Instruments & Pneumatic Products",
    "Water quality analysers measuring pH, ORP, conductivity, TDS, salinity and resistivity.",
    "Analytical instrumentation measures the chemical properties of a process fluid rather than its physical movement, and in water treatment and chemical dosing these readings drive the control loop directly.\n\n"
    "Three instruments are available: Digital pH Sensor (Modbus RS485), Conductivity / TDS / Salinity / Resistivity Meter, and pH / ORP Analyzer.\n\n"
    "pH measurement is temperature-dependent, so automatic compensation via an integral Pt1000 is essential — an uncompensated reading can be out by several tenths of a pH unit across a normal process temperature swing. Digital sensors with direct Modbus output avoid the signal degradation that affects high-impedance analogue pH cabling, which is a frequent cause of drifting readings on long runs.\n\n"
    "Conductivity, TDS, salinity and resistivity are all derived from the same underlying measurement, so a single sensor reports whichever unit the application calls for. ORP (redox potential) is measured alongside pH for disinfection control and chemical reaction monitoring.",
    build_specs(ANALYTICAL_BASE, "Available Instruments", ANALYTICAL_VARIANTS),
    APPS_UTILITY,
)

# --------------------------------------------------------------------------
# 7. Dew Point & Humidity Transmitters
# --------------------------------------------------------------------------

DEWPOINT_BASE = [
    ("Measured Parameters", "Dew point temperature, relative humidity, absolute humidity and ppm moisture"),
    ("Dew Point Range", "-80 C to +20 C Td"),
    ("Accuracy", "±1 C Td typical over the working range"),
    ("Humidity Range", "0 to 100% RH"),
    ("Sensor Technology", "Capacitive thin-film polymer sensing element"),
    ("Wetted Materials", "SS 316L body with corrosion-resistant sensor coating"),
    ("Operating Pressure", "Vacuum to 50 bar"),
    ("Output Signals", "4-20 mA, RS485 Modbus RTU, optional relay"),
    ("Process Connection", "G1/2 inch or 1/2 inch NPT threaded"),
    ("Response Time", "Typically under 30 seconds to 63% of step change"),
]

DEWPOINT_VARIANTS = [
    ("Corrosion-Resistant Dew Point Transmitter", "Coated capacitive sensor for compressed air and gas systems where trace corrosives would degrade a standard element."),
    ("Dew Point Transmitter for Corrosive Environments", "Heavy-duty construction with reinforced sensor protection for continuous service in aggressive gas streams."),
]

dewpoint = product(
    "Dew Point & Humidity Transmitters",
    "Capacitive dew point and humidity transmitters for compressed air and industrial gas systems.",
    "Dew point is the temperature at which moisture in a gas begins to condense, and in compressed air systems it is the single most useful indicator of dryer performance. Condensation downstream causes corrosion in distribution pipework, damages pneumatic tooling and ruins product in direct-contact applications, so continuous monitoring is far cheaper than the consequences of missing it.\n\n"
    "Two variants are available: Corrosion-Resistant Dew Point Transmitter and Dew Point Transmitter for Corrosive Environments.\n\n"
    "Both use a capacitive thin-film polymer element, which measures moisture by the change in dielectric constant as water is absorbed. The difference between them is protection: the first carries a coated sensor for gas streams containing trace corrosives, while the second adds reinforced sensor protection and heavier construction for continuous duty in genuinely aggressive environments.\n\n"
    "Measurement covers -80 C to +20 C dew point, spanning everything from ordinary refrigerated dryers through to desiccant systems serving instrument air and critical process applications.",
    build_specs(DEWPOINT_BASE, "Available Types", DEWPOINT_VARIANTS),
    APPS_PROCESS,
)

# --------------------------------------------------------------------------
# Merge
# --------------------------------------------------------------------------

PRODUCTS = [automation, flow, level, temperature, pressure, analytical, dewpoint]

DESCRIPTION = (
    "Precision process instrumentation and automation - flow, level, temperature, pressure and "
    "analytical measurement, dew point monitoring and complete control panel hardware for "
    "pharmaceutical, chemical, oil and gas, power and water treatment plant."
)


def main():
    with open(DATA, encoding="utf-8") as f:
        content = json.load(f)

    ip = next((c for c in content["categories"] if c.get("slug") == "instrumentation-products"), None)
    if ip is None:
        raise SystemExit("Instrumentation Products category not found.")

    ip["description"] = DESCRIPTION
    ip["children"] = PRODUCTS

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print("Instrumentation Products populated.")
    for p in PRODUCTS:
        row = next(s for s in p["keySpecifications"]
                   if s["label"].startswith(("Product Groups", "Available")))
        n = len(row["value"].split(", "))
        print(f"   {p['title']:<44} {n:>2} types  {len(p['keySpecifications']):>2} spec rows")
    print(f"\n   {len(PRODUCTS)} products -> {len(PRODUCTS)} images needed")


if __name__ == "__main__":
    main()
