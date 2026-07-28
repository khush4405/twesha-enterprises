"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import styles from "./ProductUI.module.css";

interface Breadcrumb {
  title: string;
  url: string;
}

interface ProductsHeroProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
}

export default function ProductsHero({ title, description, breadcrumbs }: ProductsHeroProps) {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroGlow}></div>
      
      <div className={styles.container} style={{ position: "relative", zIndex: 2 }}>
        
        {/* Breadcrumbs */}
        <div className={styles.breadcrumb}>
          <Link href="/">
            <Home size={14} />
          </Link>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
          
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {idx === breadcrumbs.length - 1 ? (
                <span>{crumb.title}</span>
              ) : (
                <Link href={crumb.url}>{crumb.title}</Link>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
              )}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className={styles.animateFadeInUp}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.4rem 1rem",
            background: "rgba(21, 101, 255, 0.1)",
            border: "1px solid rgba(21, 101, 255, 0.2)",
            borderRadius: "20px",
            color: "#60A5FA",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "1.5rem"
          }}>
            Global Export Portfolio
          </div>
          
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            fontWeight: 800, 
            marginBottom: "1.5rem",
            color: "var(--text-white)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}>
            {title}
          </h1>
          
          <p style={{ 
            color: "var(--text-muted)", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            lineHeight: 1.6
          }}>
            {description || "Explore our premium Fortune 500 grade catalog of industrial products, process instruments, and certified electrical components available for worldwide export."}
          </p>
        </div>
      </div>
    </div>
  );
}
