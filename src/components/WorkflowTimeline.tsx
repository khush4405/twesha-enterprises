"use client";

import { 
  FileText, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Ship, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import styles from "./WorkflowTimeline.module.css";

export default function WorkflowTimeline() {
  const steps = [
    {
      number: "01",
      title: "Inquiry",
      subtitle: "Requirement Analysis",
      description: "Submit technical specs, CAD drawings, or product quantities for rapid sourcing evaluation.",
      icon: FileText
    },
    {
      number: "02",
      title: "Supplier Selection",
      subtitle: "Tier-1 OEM Vetting",
      description: "We match your specs with ISO-certified global manufacturers to secure optimal pricing.",
      icon: Users
    },
    {
      number: "03",
      title: "Quality Inspection",
      subtitle: "Zero-Defect Audit",
      description: "Factory floor pre-shipment audit, dimensional verification, and electrical testing.",
      icon: ShieldCheck
    },
    {
      number: "04",
      title: "Documentation",
      subtitle: "Export Compliance",
      description: "Customs declaration, Certificate of Origin, Bill of Lading, and tariff compliance.",
      icon: FileSpreadsheet
    },
    {
      number: "05",
      title: "Shipping",
      subtitle: "Freight Execution",
      description: "Express air freight or ocean container dispatch with real-time GPS container tracking.",
      icon: Ship
    },
    {
      number: "06",
      title: "Delivery",
      subtitle: "Final Handover",
      description: "On-site destination delivery, customs clearance, and engineering sign-off.",
      icon: CheckCircle
    }
  ];

  return (
    <section className={styles.workflowSection}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>Streamlined Operations</span>
          </div>
          <h2 className={styles.title}>
            End-to-End International <br />
            <span className="gold-gradient-text">Procurement Workflow</span>
          </h2>
          <p className={styles.subtitle}>
            A transparent 6-step trade process designed to guarantee precision, safety, and compliance 
            from factory floor to final destination.
          </p>
        </div>

        {/* Horizontal Timeline Track */}
        <div className={styles.timelineWrapper}>
          
          {/* Connector Line behind circles */}
          <div className={styles.timelineLine}>
            <div className={styles.timelineLineGlow}></div>
          </div>

          <div className={styles.stepsContainer}>
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className={styles.stepItem}>
                  
                  {/* Floating Glass Circle */}
                  <div className={`${styles.circleFrame} glass-card`}>
                    <div className={styles.circleNumber}>{step.number}</div>
                    <div className={styles.iconWrapper}>
                      <IconComp size={24} className={styles.stepIcon} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <span className={styles.stepSubtitle}>{step.subtitle}</span>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>

                  {/* Mobile Arrow Connector */}
                  {idx < steps.length - 1 && (
                    <div className={styles.arrowConnector}>
                      <ArrowRight size={16} className={styles.goldIcon} />
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
