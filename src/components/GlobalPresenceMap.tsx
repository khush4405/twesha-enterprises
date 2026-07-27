"use client";

import { useState } from "react";
import { Globe2, Navigation2, Anchor, ShieldCheck, MapPin, ArrowUpRight } from "lucide-react";
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
      featuredCountries: ["UAE (Jebel Ali)", "Saudi Arabia", "Qatar", "Oman", "Egypt"],
      keyCorridor: "Jebel Ali → Dammam → Suez Canal Route",
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
            Twesha Enterprises maintains an active trade network spanning over 20 countries. 
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
        <div className={`${styles.mapCard} glass-card`}>
          
          {/* Map Interactive Visual */}
          <div className={styles.mapVisualContainer}>
            <div className={styles.worldMapBg}></div>
            
            {/* SVG Animated Shipping Routes */}
            <svg className={styles.shippingSvg} viewBox="0 0 1000 500" fill="none">
              {/* Route Arcs */}
              <path d="M250,220 C400,100 650,150 780,240" stroke="rgba(21, 101, 255, 0.6)" strokeWidth="2.5" strokeDasharray="8 6" className={styles.animatedRoute} />
              <path d="M780,240 C650,380 400,320 280,280" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" strokeDasharray="6 4" className={styles.animatedRouteReverse} />
              <path d="M500,180 C600,280 750,350 850,220" stroke="rgba(21, 101, 255, 0.5)" strokeWidth="2" strokeDasharray="5 5" className={styles.animatedRoute} />
              
              {/* Pulsing Port Nodes */}
              {/* Mumbai HQ */}
              <circle cx="680" cy="240" r="8" fill="#D4AF37" />
              <circle cx="680" cy="240" r="20" fill="#D4AF37" opacity="0.25" className={styles.pulseNode} />

              {/* Singapore */}
              <circle cx="780" cy="280" r="7" fill="#1565FF" />
              <circle cx="780" cy="280" r="16" fill="#1565FF" opacity="0.3" className={styles.pulseNode} />

              {/* Rotterdam */}
              <circle cx="520" cy="160" r="7" fill="#60A5FA" />
              <circle cx="520" cy="160" r="16" fill="#60A5FA" opacity="0.3" className={styles.pulseNode} />

              {/* Jebel Ali */}
              <circle cx="610" cy="220" r="7" fill="#D4AF37" />
              <circle cx="610" cy="220" r="14" fill="#D4AF37" opacity="0.3" className={styles.pulseNode} />

              {/* Houston */}
              <circle cx="250" cy="220" r="7" fill="#1565FF" />
              <circle cx="250" cy="220" r="16" fill="#1565FF" opacity="0.3" className={styles.pulseNode} />
            </svg>

            {/* Floating Live Region Card Overlay */}
            <div className={`${styles.floatingRegionOverlay} glass-card glass-card-gold`}>
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
            </div>

          </div>

          {/* Bottom Bar Metrics */}
          <div className={styles.mapFooter}>
            <div className={styles.footerMetric}>
              <Navigation2 size={18} className={styles.blueIcon} />
              <span>Full Container Load (FCL) & Less Container Load (LCL) Logistics</span>
            </div>
            <div className={styles.footerMetric}>
              <ShieldCheck size={18} className={styles.goldIcon} />
              <span>Comprehensive Marine Cargo Insurance Coverage</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
