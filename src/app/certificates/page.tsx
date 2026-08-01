import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { ShieldCheck, FileCheck } from "lucide-react";
import CtaBanner from "@/components/CtaBanner";
import styles from "../videos/Media.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certifications | Twesha Enterprises",
  description:
    "Quality certifications and approvals held by Twesha Enterprises, including ISO 9001:2015.",
};

function loadContent(): any {
  try {
    const p = path.join(process.cwd(), "src", "data", "masterContent.json");
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    console.error("Failed to read masterContent.json", e);
    return {};
  }
}

export default function CertificatesPage() {
  const content = loadContent();
  const certificates = (content.certificates || []).filter((c: any) => c && (c.image || c.title));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>
            <ShieldCheck size={14} /> Quality Assurance
          </span>
          <h1 className={styles.title}>Certifications &amp; Approvals</h1>
          <p className={styles.subtitle}>
            Independently audited quality systems and product approvals backing every shipment.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {certificates.length === 0 ? (
          <div className={styles.empty}>
            <FileCheck size={48} />
            <h3>No certificates published yet</h3>
            <p>Quality certifications and approvals will appear here.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {certificates.map((c: any) => (
              <div key={c.id} className={styles.certCard}>
                <div className={styles.certImageWrap}>
                  {c.image ? (
                    <img src={c.image} alt={c.title || "Certificate"} className={styles.certImage} loading="lazy" />
                  ) : (
                    <FileCheck size={64} color="#94A3B8" />
                  )}
                </div>
                <div className={styles.certBody}>
                  <h3 className={styles.certTitle}>{c.title || "Certificate"}</h3>
                  {c.issuer && <p className={styles.certIssuer}>{c.issuer}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CtaBanner />
    </div>
  );
}
