"use client";

import { 
  Globe2, 
  CheckCheck, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  CircleDollarSign,
  Sparkles
} from "lucide-react";
import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Global Supply Chain",
      description: "Seamless multi-modal logistics across 20+ countries with end-to-end customs clearance.",
      icon: Globe2,
      accentColor: "#1565FF"
    },
    {
      title: "Verified Manufacturers",
      description: "Exclusive sourcing agreements with Tier-1 certified OEM factories and engineering plants.",
      icon: CheckCheck,
      accentColor: "#D4AF37"
    },
    {
      title: "Quality Assurance",
      description: "Rigorous ISO 9001:2015 zero-defect testing and pre-shipment factory inspection protocols.",
      icon: ShieldCheck,
      accentColor: "#10B981"
    },
    {
      title: "Fast Logistics",
      description: "Optimized express air freight and maritime shipping routes ensuring 99%+ on-time delivery.",
      icon: Truck,
      accentColor: "#3B82F6"
    },
    {
      title: "Technical Support",
      description: "Dedicated 24/7 engineering consultation, spec matching, and post-installation guidance.",
      icon: Headphones,
      accentColor: "#F59E0B"
    },
    {
      title: "Competitive Pricing",
      description: "Direct OEM factory pricing, bulk procurement discounts, and transparent tariff management.",
      icon: CircleDollarSign,
      accentColor: "#D4AF37"
    }
  ];

  return (
    <section id="why-choose-us" className={styles.section}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.goldIcon} />
            <span>Enterprise Advantages</span>
          </div>
          <h2 className={styles.title}>
            Why Fortune 500 Leaders Choose <br />
            <span className="gold-gradient-text">Twesha Enterprise</span>
          </h2>
          <p className={styles.subtitle}>
            We combine high-precision engineering standards with global trade velocity. 
            Our commitment to quality ensures seamless industrial operations across six continents.
          </p>
        </div>

        {/* Six Neumorphic Feature Cards Grid */}
        <div className={styles.grid}>
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className={`${styles.card} neumorphic-card`}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconEmboss}>
                    <IconComp size={28} className={styles.icon} />
                  </div>
                  <span className={styles.cardNumber}>0{idx + 1}</span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.pillText}>Enterprise Standard</span>
                  <div className={styles.glowDot}></div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
