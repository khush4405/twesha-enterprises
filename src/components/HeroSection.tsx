"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  Globe2, 
  Cpu, 
  Ship, 
  CheckCircle2, 
  Activity, 
  Shield, 
  Zap, 
  Boxes,
  Compass
} from "lucide-react";
import styles from "./HeroSection.module.css";
import GlobalQuoteModal from "./GlobalQuoteModal";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { number: "20+", label: "Countries", icon: <Globe2 size={18} /> },
    { number: "500+", label: "Industrial Products", icon: <Boxes size={18} /> },
    { number: "1000+", label: "Global Clients", icon: <Shield size={18} /> },
    { number: "99%", label: "On-Time Delivery", icon: <CheckCircle2 size={18} /> }
  ];

  return (
    <>
      <section id="hero" className={styles.heroSection}>
        {/* Low-opacity TE Logo Watermark Background */}
        <div className={styles.watermarkContainer}>
          <img 
            src="/Twesha EnterPrize logo.png" 
            alt="Twesha Enterprises Watermark" 
            className={styles.heroWatermark}
          />
        </div>

        {/* Ambient Glowing Lighting Effects */}
        <div className={styles.ambientGlowBlue}></div>
        <div className={styles.ambientGlowGold}></div>

        {/* Grid Overlay */}
        <div className={styles.gridOverlay}></div>

        <div className={styles.container}>
          {/* LEFT SIDE: Text & Stats */}
          <div className={styles.leftContent}>
            {/* Top Badge */}
            <div className={styles.badge}>
              <span className={styles.badgePulse}></span>
              <span className={styles.badgeText}>ISO 9001:2015 Certified Global Exporter</span>
            </div>

            {/* Headline */}
            <h1 className={styles.mainTitle}>
              Connecting Industries <br />
              <span className="white-gradient-text">Across Borders.</span>
            </h1>
            
            <h2 className={styles.subTitle}>
              <span className="gold-gradient-text">Engineering Global Trade.</span>
            </h2>

            {/* Paragraph */}
            <p className={styles.description}>
              Twesha Enterprises delivers world-class industrial products, automation solutions, 
              electrical equipment, and engineering supplies through reliable international sourcing 
              and export services.
            </p>

            {/* Action Buttons */}
            <div className={styles.heroButtons}>
              <button 
                className="btn-gold" 
                onClick={() => setIsModalOpen(true)}
              >
                <span>Get Quote</span>
                <ArrowRight size={18} />
              </button>
              
              <a href="#products" className="btn-glass">
                <span>Explore Products</span>
                <Compass size={18} />
              </a>
            </div>

            {/* Four Statistics Grid */}
            <div className={styles.statsGrid}>
              {stats.map((stat, idx) => (
                <div key={idx} className={styles.statCard}>
                  <div className={styles.statIconHeader}>
                    <span className={styles.statIcon}>{stat.icon}</span>
                    <span className={styles.statNumber}>{stat.number}</span>
                  </div>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Futuristic Keynote Composition */}
          <div className={styles.rightComposition}>
            <div className={styles.compositionFrame}>
              
              {/* Central Glowing 3D Map / Trade Hub Display */}
              <div className={styles.mapVisual}>
                {/* SVG Trade Route Beams */}
                <svg className={styles.routeSvg} viewBox="0 0 500 400" fill="none">
                  {/* Glowing Node Beams */}
                  <path d="M70,180 Q200,60 380,120" stroke="url(#blueGrad)" strokeWidth="2.5" strokeDasharray="6 4" className={styles.animatedRoute} />
                  <path d="M120,280 Q280,180 430,240" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="8 5" className={styles.animatedRouteReverse} />
                  <path d="M70,180 Q250,300 430,240" stroke="url(#blueGrad)" strokeWidth="2" strokeDasharray="4 4" className={styles.animatedRoute} />
                  
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1565FF" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1565FF" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#F8E7A2" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Pulsing Trade Nodes */}
                  <circle cx="70" cy="180" r="6" fill="#1565FF" />
                  <circle cx="70" cy="180" r="14" fill="#1565FF" opacity="0.25" className={styles.pulseNode} />

                  <circle cx="380" cy="120" r="6" fill="#D4AF37" />
                  <circle cx="380" cy="120" r="14" fill="#D4AF37" opacity="0.3" className={styles.pulseNode} />

                  <circle cx="430" cy="240" r="6" fill="#1565FF" />
                  <circle cx="430" cy="240" r="14" fill="#1565FF" opacity="0.25" className={styles.pulseNode} />

                  <circle cx="120" cy="280" r="6" fill="#D4AF37" />
                  <circle cx="120" cy="280" r="12" fill="#D4AF37" opacity="0.2" className={styles.pulseNode} />
                </svg>

                {/* Industrial Hologram Graphic Center */}
                <div className={styles.hologramCore}>
                  <div className={styles.ringOuter}></div>
                  <div className={styles.ringInner}></div>
                  <div className={styles.coreCenter}>
                    <Cpu size={42} className={styles.coreIcon} />
                  </div>
                </div>
              </div>

              {/* Floating Glass Cards */}

              {/* Floating Card 1: Active Freight Tracker */}
              <div className={`${styles.floatingCard} ${styles.cardTopLeft} glass-card`}>
                <div className={styles.cardHeader}>
                  <Ship size={18} className={styles.blueIcon} />
                  <span className={styles.cardTitle}>Trade Route #TE-9042</span>
                  <span className={styles.liveIndicator}>LIVE</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.routeDetail}>
                    <span>Port of Mumbai</span>
                    <span className={styles.arrowIcon}>→</span>
                    <span>Hamburg, DE</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                  </div>
                  <div className={styles.cardFooter}>
                    <span>Cargo Vessel In Transit</span>
                    <span className={styles.statusText}>99.4% On-Time</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Precision Sensor Inspection */}
              <div className={`${styles.floatingCard} ${styles.cardBottomRight} glass-card glass-card-gold`}>
                <div className={styles.cardHeader}>
                  <Activity size={18} className={styles.goldIcon} />
                  <span className={styles.cardTitle}>QA Verified Instrument</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.sensorMetric}>
                    <span className={styles.metricVal}>0.01ms</span>
                    <span className={styles.metricDesc}>Flow Control Latency</span>
                  </div>
                  <div className={styles.tags}>
                    <span className={styles.tag}>ISO-9001</span>
                    <span className={styles.tagGold}>CE Certified</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Robotic Automation */}
              <div className={`${styles.floatingCard} ${styles.cardCenterRight} glass-card`}>
                <div className={styles.cardHeader}>
                  <Zap size={18} className={styles.blueIcon} />
                  <span className={styles.cardTitle}>Automation Sourcing</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.subText}>Direct OEM Tier-1 Procurement</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <GlobalQuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
