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
            
            <svg className={styles.shippingSvg} viewBox="0 0 1000 500" fill="none">
              <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1565FF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Origin Node: Gujarat, India */}
              <circle cx="695" cy="225" r="4" fill="#D4AF37" />
              <circle cx="695" cy="225" r="8" fill="none" stroke="#D4AF37" strokeWidth="1" />

              {/* Dynamic Routes & Destination Nodes based on active tab */}
              {activeRegion === "asia" && (
                <>
                  {/* To Singapore (via Sri Lanka tip) */}
                  <path d="M695,225 C700,265 720,280 790,280" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="790" cy="280" r="4" fill="#1565FF" />
                  
                  {/* To Japan (via Singapore straits) */}
                  <path d="M695,225 C700,265 720,280 790,280 C830,280 850,220 875,170" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="875" cy="170" r="4" fill="#1565FF" />
                </>
              )}

              {activeRegion === "europe" && (
                <>
                  {/* To Rotterdam (via Suez, Med, Gibraltar, North Sea) */}
                  <path d="M695,225 Q630,240 585,210 C530,190 480,190 485,180 C470,140 490,130 500,120" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="500" cy="120" r="4" fill="#1565FF" />
                </>
              )}

              {activeRegion === "middleeast" && (
                <>
                  {/* To UAE (across Arabian Sea) */}
                  <path d="M695,225 Q670,240 645,230" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="645" cy="230" r="4" fill="#1565FF" />

                  {/* To Egypt / Suez (Red Sea) */}
                  <path d="M695,225 Q630,240 585,210" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="585" cy="210" r="4" fill="#1565FF" />
                </>
              )}

              {activeRegion === "americas" && (
                <>
                  {/* To USA (Houston via Suez and Gibraltar) */}
                  <path d="M695,225 Q630,240 585,210 C530,190 480,190 485,180 C400,200 300,220 220,200" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="220" cy="200" r="4" fill="#1565FF" />

                  {/* To Brazil (via Cape of Good Hope, South Africa) */}
                  <path d="M695,225 C660,300 590,380 550,380 C450,380 380,360 330,340" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.staticRoute} />
                  <circle cx="330" cy="340" r="4" fill="#1565FF" />
                </>
              )}

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
