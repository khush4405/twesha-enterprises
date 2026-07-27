"use client";

import { Award, ShieldCheck, FileCheck, CheckCircle2, BadgeCheck } from "lucide-react";
import styles from "./CertificationsSection.module.css";

export default function CertificationsSection() {
  const certs = [
    {
      id: "iso",
      title: "ISO 9001:2015 Certification",
      issuer: "International Organization for Standardization",
      category: "Quality Management System",
      code: "CERT-ISO-9001-2025-TE",
      description: "Certified operational excellence across industrial product sourcing, testing, documentation, and international export procedures.",
      icon: Award
    },
    {
      id: "license",
      title: "Authorized Export License",
      issuer: "Directorate General of Foreign Trade (DGFT)",
      category: "International Trade License",
      code: "IEC-GLOBAL-EX-88942",
      description: "Government-accredited international trading status for cross-border export of heavy engineering equipment, sensors, and electrical components.",
      icon: BadgeCheck
    },
    {
      id: "qa",
      title: "Zero-Defect Quality Assurance",
      issuer: "Global Industrial Inspection Bureau",
      category: "Factory Audit Seal",
      code: "QA-AUDIT-PASS-100",
      description: "Rigorous 5-point physical & electrical verification protocol executed prior to container sealing and ocean/air freight dispatch.",
      icon: ShieldCheck
    },
    {
      id: "compliance",
      title: "RoHS & CE Compliance Seal",
      issuer: "European Conformity & Environmental Agency",
      category: "Global Regulatory Standard",
      code: "CE-ROHS-2026-STND",
      description: "Full compliance with hazardous substance limits and electromagnetic compatibility standards across European & North American markets.",
      icon: FileCheck
    }
  ];

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
          {certs.map((cert) => {
            const IconComp = cert.icon;
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
