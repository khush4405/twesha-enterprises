"use client";

import { Globe, Target, Eye, Award, Check, TrendingUp, Building2 } from "lucide-react";
import styles from "./AboutTwesha.module.css";

export default function AboutTwesha() {
  const hubs = [
    { name: "Ankleshwar HQ", status: "Primary Export Hub" },
    { name: "Dubai, UAE", status: "MENA Distribution" },
    { name: "Frankfurt, DE", status: "European Gateway" },
    { name: "Singapore", status: "APAC Logistics Center" },
    { name: "Houston, USA", status: "Americas Trade Hub" },
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <Building2 size={14} className={styles.goldIcon} />
            <span>Corporate Intelligence</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Engineering Global Trade <br />
            <span className="gold-gradient-text">Built On Uncompromised Trust</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Twesha Enterprise bridges manufacturing powerhouses with global industrial markets. 
            We specialize in end-to-end international procurement, quality compliance, and cross-border logistics.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className={styles.gridContainer}>
          {/* LEFT COLUMN: Story & Interactive World Map Hubs */}
          <div className={`${styles.storyCard} glass-card`}>
            <div className={styles.cardGlow}></div>
            
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>
                <Globe size={22} className={styles.blueIcon} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Global Sourcing Ecosystem</h3>
                <p className={styles.cardSubtitle}>Connected International Trade Corridors</p>
              </div>
            </div>

            <p className={styles.cardText}>
              Established to streamline complex international industrial supply chains, 
              Twesha Enterprise operates across key industrial centers worldwide. We partner exclusively 
              with certified OEM manufacturers to deliver precision automation, instrumentation, 
              and electrical equipment to 20+ countries.
            </p>

            {/* Hubs Grid Display */}
            <div className={styles.hubsTitle}>Strategic Logistics & Trade Hubs</div>
            <div className={styles.hubsGrid}>
              {hubs.map((hub, idx) => (
                <div key={idx} className={styles.hubChip}>
                  <span className={styles.hubDot}></span>
                  <div className={styles.hubInfo}>
                    <span className={styles.hubName}>{hub.name}</span>
                    <span className={styles.hubStatus}>{hub.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive World Connection Map Preview */}
            <div className={styles.mapGraphic}>
              <div className={styles.mapGridLines}></div>
              <div className={styles.mapGlowCore}></div>
              
              {/* Connected Node Lines */}
              <svg className={styles.mapLinesSvg} viewBox="0 0 400 120" fill="none">
                <path d="M40,60 C120,20 200,90 280,40 C320,20 360,70 380,50" stroke="rgba(21, 101, 255, 0.5)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M80,90 C160,40 240,80 340,30" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" />
                <circle cx="40" cy="60" r="4" fill="#1565FF" />
                <circle cx="280" cy="40" r="5" fill="#D4AF37" />
                <circle cx="380" cy="50" r="4" fill="#60A5FA" />
              </svg>

              <div className={styles.mapOverlayLabel}>
                <TrendingUp size={14} className={styles.goldIcon} />
                <span>Real-Time Trade Route Monitoring</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mission & Vision Glass Cards */}
          <div className={styles.rightColumn}>
            
            {/* Mission Card */}
            <div className={`${styles.pillarCard} glass-card glass-card-hover`}>
              <div className={styles.pillarHeader}>
                <div className={`${styles.pillarIconCircle} ${styles.blueGradientBg}`}>
                  <Target size={22} className={styles.whiteIcon} />
                </div>
                <div>
                  <h3 className={styles.pillarTitle}>Our Mission</h3>
                  <span className={styles.pillarTag}>Sourcing Excellence</span>
                </div>
              </div>
              <p className={styles.pillarText}>
                To empower global industries with seamless access to certified engineering equipment 
                and automation solutions, eliminating supply chain friction through rigorous quality assurance 
                and rapid international trade logistics.
              </p>
              <ul className={styles.featureList}>
                <li><Check size={14} className={styles.checkIcon} /> Direct Manufacturer Pricing</li>
                <li><Check size={14} className={styles.checkIcon} /> Zero-Defect Inspection Protocol</li>
              </ul>
            </div>

            {/* Vision Card */}
            <div className={`${styles.pillarCard} glass-card glass-card-gold`}>
              <div className={styles.pillarHeader}>
                <div className={`${styles.pillarIconCircle} ${styles.goldGradientBg}`}>
                  <Eye size={22} className={styles.darkIcon} />
                </div>
                <div>
                  <h3 className={styles.pillarTitle}>Our Vision</h3>
                  <span className={styles.pillarTagGold}>Future-Ready Trade</span>
                </div>
              </div>
              <p className={styles.pillarText}>
                To stand as the premier Fortune 500 partner for international industrial procurement, 
                pioneering transparent, AI-optimized logistics corridors and setting the global standard 
                for industrial supply chain reliability.
              </p>
              <ul className={styles.featureList}>
                <li><Check size={14} className={styles.checkIconGold} /> 100% Export Regulatory Compliance</li>
                <li><Check size={14} className={styles.checkIconGold} /> Dedicated Technical Engineering Support</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
