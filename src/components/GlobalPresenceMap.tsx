"use client";

import { useState } from "react";
import { Globe2, Navigation2, Anchor, ShieldCheck, MapPin } from "lucide-react";
import {
  MAP_W, MAP_H, ORIGIN, REGION_GEO, project, smoothPath, regionTransform,
} from "@/lib/tradeRoutes";
import styles from "./GlobalPresenceMap.module.css";

interface Region {
  id: string;
  name: string;
  portsCount: number;
  hubsCount: number;
  featuredCountries: string[];
  keyCorridor: string;
  status: string;
}

export default function GlobalPresenceMap() {
  const [activeRegion, setActiveRegion] = useState<string>("asia");

  const regions: Region[] = [
    {
      id: "asia",
      name: "Asia-Pacific (APAC)",
      portsCount: 18,
      hubsCount: 6,
      featuredCountries: ["India (HQ)", "Singapore", "Japan", "South Korea", "Vietnam", "UAE"],
      keyCorridor: "Mumbai Port → Singapore Straits → Tokyo Bay",
      status: "High Volume Primary Hub"
    },
    {
      id: "europe",
      name: "Europe & UK",
      portsCount: 12,
      hubsCount: 4,
      featuredCountries: ["Germany", "Netherlands", "United Kingdom", "Italy", "France"],
      keyCorridor: "Rotterdam → Hamburg → Antwerp Gateway",
      status: "Automated Precision Network"
    },
    {
      id: "middleeast",
      name: "Middle East & Africa",
      portsCount: 10,
      hubsCount: 3,
      featuredCountries: ["UAE", "Saudi Arabia", "Qatar", "Oman", "Egypt"],
      keyCorridor: "UAE → Dammam → Suez Canal Route",
      status: "Energy & Infrastructure Corridor"
    },
    {
      id: "americas",
      name: "Americas",
      portsCount: 8,
      hubsCount: 3,
      featuredCountries: ["United States", "Canada", "Brazil", "Mexico"],
      keyCorridor: "Houston → Los Angeles → Santos Port",
      status: "Heavy Industrial Sourcing"
    }
  ];

  const currentRegion = regions.find(r => r.id === activeRegion) || regions[0];

  return (
    <section id="global-presence" className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Globe2 size={14} className={styles.goldIcon} />
            <span>International Infrastructure</span>
          </div>
          <h2 className={styles.title}>
            Global Trade Reach & <br />
            <span className="blue-gradient-text">Connected Shipping Routes</span>
          </h2>
          <p className={styles.subtitle}>
            Twesha Enterprise maintains an active trade network spanning over 20 countries. 
            We coordinate air, ocean, and overland freight across major global maritime corridors.
          </p>
        </div>

        {/* Region Selector Tabs */}
        <div className={styles.tabsRow}>
          {regions.map((region) => (
            <button 
              key={region.id} 
              className={`${styles.tabBtn} ${activeRegion === region.id ? styles.tabActive : ""}`}
              onClick={() => setActiveRegion(region.id)}
            >
              <MapPin size={16} />
              <span>{region.name}</span>
            </button>
          ))}
        </div>

        {/* Map & Stats Interactive Container */}
        <div className={styles.mapLayout}>

          {/* Map Interactive Visual */}
          <div className={`${styles.mapCard} glass-card`}>
          <div className={styles.mapVisualContainer}>

            <svg
              className={styles.shippingSvg}
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="laneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="55%" stopColor="#4d8bff" />
                  <stop offset="100%" stopColor="#1565FF" />
                </linearGradient>
                <filter id="laneGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="oceanTint" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0d2036" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#020408" stopOpacity="0.85" />
                </radialGradient>
              </defs>

              {/* Everything geographic lives in this group so the map graphic and
                  the routes zoom together and stay aligned. */}
              <g className={styles.geoLayer} transform={regionTransform(activeRegion)}>
                <image
                  href="/world-map.svg"
                  x="0" y="0" width={MAP_W} height={MAP_H}
                  className={styles.landmass}
                  preserveAspectRatio="none"
                />

                {REGION_GEO[activeRegion]?.routes.map((route, i) => {
                  const d = smoothPath(route.points);
                  const [dx, dy] = project(route.points[route.points.length - 1]);
                  return (
                    <g key={`${activeRegion}-${route.label}`}>
                      {/* faint base lane */}
                      <path d={d} className={styles.laneBase} vectorEffect="non-scaling-stroke" />
                      {/* animated draw-in */}
                      <path
                        d={d}
                        className={styles.laneDraw}
                        pathLength={1}
                        vectorEffect="non-scaling-stroke"
                        filter="url(#laneGlow)"
                        style={{ animationDelay: `${i * 0.35}s` }}
                      />
                      {/* flowing dashes along the lane */}
                      <path
                        d={d}
                        className={styles.laneFlow}
                        vectorEffect="non-scaling-stroke"
                        style={{ animationDelay: `${i * 0.35 + 1.1}s` }}
                      />
                      {/* destination */}
                      <g style={{ animationDelay: `${i * 0.35 + 1.4}s` }} className={styles.destGroup}>
                        <circle cx={dx} cy={dy} r={7} className={styles.destHalo} />
                        <circle cx={dx} cy={dy} r={3.2} className={styles.destDot} />
                        <text x={dx} y={dy - 13} className={styles.destLabel} textAnchor="middle">
                          {route.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Origin: Kandla Port, Gujarat */}
                {(() => {
                  const [ox, oy] = project(ORIGIN);
                  return (
                    <g>
                      <circle cx={ox} cy={oy} r={9} className={styles.originPulse} />
                      <circle cx={ox} cy={oy} r={4.2} className={styles.originDot} />
                      <text x={ox} y={oy + 20} className={styles.originLabel} textAnchor="middle">
                        Gujarat, India
                      </text>
                    </g>
                  );
                })()}
              </g>

              <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#oceanTint)" pointerEvents="none" />
            </svg>

          </div>

          {/* Bottom Bar Metrics */}
          <div className={styles.mapFooter}>
            <div className={styles.footerMetric}>
              <Navigation2 size={18} className={styles.blueIcon} />
              <span>Full Container Load (FCL) &amp; Less Container Load (LCL) Logistics</span>
            </div>
            <div className={styles.footerMetric}>
              <ShieldCheck size={18} className={styles.goldIcon} />
              <span>Comprehensive Marine Cargo Insurance Coverage</span>
            </div>
          </div>
          </div>

          {/* Region detail panel - beside the map, never covering it */}
          <aside className={`${styles.regionPanel} glass-card glass-card-gold`} key={activeRegion}>
              <div className={styles.overlayHeader}>
                <Anchor size={18} className={styles.goldIcon} />
                <span className={styles.overlayTitle}>{currentRegion.name}</span>
                <span className={styles.liveTag}>ACTIVE NETWORK</span>
              </div>

              <div className={styles.overlayStatsRow}>
                <div className={styles.overlayStat}>
                  <span className={styles.statVal}>{currentRegion.portsCount}+</span>
                  <span className={styles.statLbl}>Seaports & Airports</span>
                </div>
                <div className={styles.overlayStat}>
                  <span className={styles.statVal}>{currentRegion.hubsCount}</span>
                  <span className={styles.statLbl}>Logistics Centers</span>
                </div>
              </div>

              <div className={styles.corridorBox}>
                <span className={styles.corridorLbl}>Primary Freight Corridor:</span>
                <span className={styles.corridorVal}>{currentRegion.keyCorridor}</span>
              </div>

              <div className={styles.countriesList}>
                <span className={styles.countriesTitle}>Key Markets:</span>
                <div className={styles.countryBadges}>
                  {currentRegion.featuredCountries.map((country, idx) => (
                    <span key={idx} className={styles.countryBadge}>{country}</span>
                  ))}
                </div>
              </div>
          </aside>

        </div>

      </div>
    </section>
  );
}
