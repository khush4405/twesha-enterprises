"use client";

import { Award, ShieldCheck, FileCheck, CheckCircle2, BadgeCheck } from "lucide-react";
import styles from "./CertificationsSection.module.css";

export default function CertificationsSection({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="certifications" className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Award size={14} className={styles.goldIcon} />
            <span>Accreditation & Standards</span>
          </div>
          <h2 className={styles.title}>
            International Compliance & <br />
            <span className="gold-gradient-text">Luxury Certifications</span>
          </h2>
          <p className={styles.subtitle}>
            Twesha Enterprises adheres to strict global engineering standards, guaranteeing total legal, regulatory, and quality compliance for every order.
          </p>
        </div>

        {/* Luxury Certificates Grid */}
        <div className={styles.grid}>
          {data.map((cert: any) => {
            const IconComp = Award; // Default to Award since we don't store Lucide icons in JSON
            return (
              <div key={cert.id} className={`${styles.certCard} glass-card glass-card-gold`}>
                
                {/* Metallic Gold Wax Seal Badge */}
                <div className={styles.waxSeal}>
                  <div className={styles.waxInner}>
                    <IconComp size={24} className={styles.sealIcon} />
                  </div>
                </div>

                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{cert.category}</span>
                  <span className={styles.certCode}>{cert.code}</span>
                </div>

                <h3 className={styles.certTitle}>{cert.title}</h3>
                <span className={styles.issuerText}>Issued by {cert.issuer}</span>

                <p className={styles.certDesc}>{cert.description}</p>

                <div className={styles.certFooter}>
                  <div className={styles.verifiedRow}>
                    <CheckCircle2 size={16} className={styles.goldIcon} />
                    <span>Active & Verified Status</span>
                  </div>
                  <div className={styles.goldRibbon}></div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
