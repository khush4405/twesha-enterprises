/**
 * Geographic data for the Global Presence map.
 *
 * The map graphic (/world-map.svg) is an equirectangular projection that is
 * stretched vertically: longitude -180..180 spans the full width, latitude
 * +83.6..-90 spans the full height. Calibrated against known port positions.
 *
 * Because the map image and the route paths are rendered inside the SAME
 * <svg> viewBox, anything projected with project() lands in the right place.
 */

export const MAP_W = 1000;
export const MAP_H = 556;

/**
 * Calibration for /world-map.svg.
 *
 * The artwork is NOT a textbook -180..180 equirectangular: its content sits
 * about 10.25 degrees west of where a naive mapping would put it, and the
 * vertical extent runs from +85 to -90. These constants were solved by
 * classifying 36 known land/sea points against the rendered artwork
 * (35/36 correct - the miss is Sydney, which is coastal).
 *
 * If the map graphic is ever replaced, re-solve these three numbers.
 */
const LON_OFFSET = 10.25;
const LAT_TOP = 85.0;
const LAT_BOTTOM = -90;

export type LonLat = [number, number];

export function project([lon, lat]: LonLat): [number, number] {
  const x = ((lon - LON_OFFSET + 180) / 360) * MAP_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * MAP_H;
  return [x, y];
}

/** Origin: Kandla Port, Gujarat */
export const ORIGIN: LonLat = [70.22, 23.03];

export interface Route {
  label: string;
  /** Sea-lane waypoints, origin first, destination last */
  points: LonLat[];
}

export interface RegionGeo {
  id: string;
  routes: Route[];
  /** Extra padding in degrees when framing this region */
  zoomPad?: number;
}

/* Shared lane segments, so corridors stay consistent between regions */
const TO_ADEN: LonLat[] = [[65, 20], [58, 14], [48, 12], [43.3, 12.6]];
const RED_SEA_TO_SUEZ: LonLat[] = [[38, 20], [34, 27], [32.5, 30], [32.3, 31.5]];
const MED_TO_GIBRALTAR: LonLat[] = [[25, 33], [15, 36], [5, 37], [-5.6, 36]];
const AROUND_INDIA: LonLat[] = [[72, 18], [75, 8], [81, 5.5], [88, 6], [95, 6], [99, 3]];

export const REGION_GEO: Record<string, RegionGeo> = {
  asia: {
    id: "asia",
    routes: [
      {
        label: "Singapore",
        points: [ORIGIN, ...AROUND_INDIA, [103.85, 1.35]],
      },
      {
        label: "Tokyo Bay",
        points: [
          ORIGIN, ...AROUND_INDIA, [103.85, 1.35],
          [110, 10], [115, 18], [121, 22], [125, 28], [139.7, 35.7],
        ],
      },
    ],
  },

  europe: {
    id: "europe",
    routes: [
      {
        label: "Rotterdam",
        points: [
          ORIGIN, ...TO_ADEN, ...RED_SEA_TO_SUEZ, ...MED_TO_GIBRALTAR,
          [-9.5, 38], [-9.5, 45], [-5, 48], [-1.5, 49.8], [2, 51.2], [4.48, 51.92],
        ],
      },
    ],
  },

  middleeast: {
    id: "middleeast",
    routes: [
      {
        label: "UAE",
        points: [ORIGIN, [65, 22], [60, 24.5], [56.5, 26.5], [55.06, 25.01]],
      },
      {
        label: "Suez Canal",
        points: [ORIGIN, ...TO_ADEN, [38, 20], [34, 27], [32.5, 30]],
      },
    ],
  },

  americas: {
    id: "americas",
    routes: [
      {
        label: "Houston",
        points: [
          ORIGIN, ...TO_ADEN, ...RED_SEA_TO_SUEZ, ...MED_TO_GIBRALTAR,
          [-20, 34], [-40, 30], [-65, 25], [-80, 24], [-90, 26], [-95.36, 29.76],
        ],
      },
      {
        label: "Santos",
        points: [
          ORIGIN, [68, 15], [60, 5], [50, -10], [40, -25],
          [22, -37], [8, -37], [-10, -31], [-30, -27], [-46.33, -23.96],
        ],
      },
    ],
  },
};

/**
 * Smooth path through points using a Catmull-Rom -> cubic Bezier conversion,
 * so shipping lanes curve naturally instead of showing hard corners.
 */
export function smoothPath(lonlats: LonLat[]): string {
  const p = lonlats.map(project);
  if (p.length < 2) return "";
  if (p.length === 2) return `M${p[0][0]},${p[0][1]} L${p[1][0]},${p[1][1]}`;

  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const t = 6; // tension divisor - higher = tighter to the points
    const c1x = p1[0] + (p2[0] - p0[0]) / t;
    const c1y = p1[1] + (p2[1] - p0[1]) / t;
    const c2x = p2[0] - (p3[0] - p1[0]) / t;
    const c2y = p2[1] - (p3[1] - p1[1]) / t;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * Frame the active region: returns an SVG transform that zooms and pans so all
 * of its routes are comfortably visible.
 */
export function regionTransform(regionId: string): string {
  const geo = REGION_GEO[regionId];
  if (!geo) return "translate(0 0) scale(1)";

  const pts = geo.routes.flatMap((r) => r.points).map(project);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);

  const pad = 70;
  const x0 = Math.min(...xs) - pad;
  const x1 = Math.max(...xs) + pad;
  const y0 = Math.min(...ys) - pad;
  const y1 = Math.max(...ys) + pad;

  const w = Math.max(x1 - x0, 1);
  const h = Math.max(y1 - y0, 1);

  // Fit, but never zoom out below 1x and never past 2.8x
  const scale = Math.min(Math.max(Math.min(MAP_W / w, MAP_H / h), 1), 2.8);

  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;

  let tx = MAP_W / 2 - cx * scale;
  let ty = MAP_H / 2 - cy * scale;

  // Keep the map covering the viewport - no empty gutters
  tx = Math.min(0, Math.max(tx, MAP_W - MAP_W * scale));
  ty = Math.min(0, Math.max(ty, MAP_H - MAP_H * scale));

  return `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(3)})`;
}
