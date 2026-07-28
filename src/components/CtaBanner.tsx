"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Sparkles } from "lucide-react";
import styles from "./CtaBanner.module.css";
export default function CtaBanner() {

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          
          <div className={`${styles.ctaCard} glass-card glass-card-gold`}>
            
            {/* Background Blue & Gold Light Rays */}
            <div className={styles.rayBlue}></div>
            <div className={styles.rayGold}></div>

            <div className={styles.content}>
              
              <div className={styles.badge}>
                <Sparkles size={14} className={styles.goldIcon} />
                <span>Next-Generation Global Sourcing</span>
              </div>

              <h2 className={styles.title}>
                Let's Build Your Global <br />
                <span className="gold-gradient-text">Supply Chain Infrastructure</span>
              </h2>

              <p className={styles.description}>
                Connect with our senior international procurement engineers today. 
                Get customized factory pricing, ISO compliance verification, and ocean/air freight schedules for your next project.
              </p>

              <div className={styles.ctaGroup}>
                <Link 
                  href="/contact" 
                  className="btn-gold" 
                  style={{ textDecoration: 'none' }}
                >
                  <Globe size={18} />
                  Request Global Quote
                </Link>
                
                <div className={styles.trustBadge}>
                  <Shield size={16} className={styles.blueIcon} />
                  <span>Nondisclosure & Enterprise SLA Guarantee</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
