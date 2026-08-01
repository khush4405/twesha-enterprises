"use client";

import { useState } from "react";
import Link from "next/link";
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
  Compass,
  Globe
} from "lucide-react";
import styles from "./HeroSection.module.css";
import GlobalQuoteModal from "./GlobalQuoteModal";

export default function HeroSection() {
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
            src="/Twesha EnterPrize logo new.webp" 
            alt="Twesha Enterprise Watermark" 
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
              Twesha Enterprise delivers world-class industrial products, automation solutions, 
              electrical equipment, and engineering supplies through reliable international sourcing 
              and export services.
            </p>

            {/* Action Buttons */}
            <div className={styles.heroButtons}>
              <Link 
                href="/contact" 
                className="btn-gold" 
                style={{ textDecoration: 'none' }}
              >
                <Globe size={18} />
                Request Global Quote
              </Link>
              
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
        </div>
      </section>
    </>
  );
}
