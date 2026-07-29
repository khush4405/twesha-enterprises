"use client";

import { useState } from "react";
import { Download, Package, ArrowRight, CheckCircle2, MessageCircle, FileText, Settings, LayoutGrid, Award, PlayCircle } from "lucide-react";
import Link from "next/link";
import styles from "./catalog/ProductUI.module.css";

export default function ProductDetail({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("description");

  // Mock data for missing fields to show UI completeness
  const specs = product.keySpecifications || [
    { label: "Material", value: "Industrial Grade Stainless Steel" },
    { label: "Operating Temp", value: "-40°C to +85°C" },
    { label: "Protection Class", value: "IP67 / NEMA 4X" },
    { label: "Power Supply", value: "24V DC / 110-220V AC" }
  ];
  
  const applications = product.applications || [
    { title: "Oil & Gas", desc: "Refinery automation and control.", icon: <Settings size={24} /> },
    { title: "Water Treatment", desc: "Purification and flow management.", icon: <Settings size={24} /> },
    { title: "Power Plants", desc: "Energy distribution systems.", icon: <Settings size={24} /> }
  ];

  const certificates = product.certificates || [
    { title: "ISO 9001:2015", size: "1.2 MB", type: "PDF" },
    { title: "CE Declaration of Conformity", size: "850 KB", type: "PDF" }
  ];

  return (
    <div className="product-detail-container" style={{ padding: "0 0 4rem 0", color: "var(--text-white)" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "4rem", 
        alignItems: "start",
        marginBottom: "4rem"
      }}>
        
        {/* Left Side: Premium Image Presentation */}
        <div style={{
          position: "sticky",
          top: "120px",
          background: "linear-gradient(145deg, rgba(15, 28, 48, 0.8), rgba(6, 13, 24, 0.9))",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          aspectRatio: "4/3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* HUD Rings & Perspective Grid Background */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, rgba(21, 101, 255, 0.15) 0%, transparent 60%)",
            zIndex: 1
          }}></div>
          
          <div style={{
            position: "absolute",
            width: "80%",
            height: "80%",
            border: "1px dashed rgba(21, 101, 255, 0.3)",
            borderRadius: "50%",
            animation: "spin 20s linear infinite",
            zIndex: 1
          }}></div>

          <div style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            height: "40%",
            background: "linear-gradient(to top, rgba(21, 101, 255, 0.1), transparent)",
            transform: "perspective(300px) rotateX(60deg)",
            transformOrigin: "bottom",
            borderTop: "1px solid rgba(21, 101, 255, 0.3)",
            zIndex: 1
          }}></div>

          {/* Product Image */}
          <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", padding: "2rem" }}>
            {product.image || product.coverImage ? (
              <img 
                src={product.image || product.coverImage} 
                alt={product.title}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.8))"
                }}
              />
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(21, 101, 255, 0.4)" }}>
                <Package size={80} style={{ marginBottom: "1rem" }} />
                <span style={{ fontWeight: 600 }}>No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className={styles.animateFadeInUp}>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: "0.5rem",
              padding: "6px 12px", 
              background: "rgba(21, 101, 255, 0.1)", 
              color: "#60A5FA", 
              borderRadius: "20px", 
              fontSize: "0.75rem", 
              fontWeight: 700, 
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
              border: "1px solid rgba(21, 101, 255, 0.2)"
            }}>
              <Package size={14} />
              {product.type === "product" ? "Industrial Product" : product.type}
            </div>
            
            <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "1.2rem", lineHeight: 1.1, color: "var(--text-white)", letterSpacing: "-0.02em" }}>
              {product.title}
            </h1>
            
            <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: 1.7 }}>
              {product.shortDescription || "High performance industrial equipment designed for reliability and accuracy. Built for harsh environments and certified for global export."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem", animationDelay: "0.1s" }} className={styles.animateFadeInUp}>
            <Link 
              href="/contact"
              className="btn-blue"
              style={{ textDecoration: "none" }}
            >
              Request a Quote <ArrowRight size={18} />
            </Link>

            <a 
              href="https://wa.me/yourwhatsappnumber" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
              style={{ textDecoration: "none", color: "#10B981" }}
            >
              <MessageCircle size={18} /> WhatsApp
            </a>

            {product.catalogueAttachment && (
              <a 
                href={product.catalogueAttachment} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass"
                style={{ textDecoration: "none" }}
              >
                <Download size={18} /> Datasheet
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className={styles.tabsContainer}>
        <div className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`} onClick={() => setActiveTab('description')}>
          <FileText size={18} /> Description
        </div>
        <div className={`${styles.tab} ${activeTab === 'specifications' ? styles.tabActive : ''}`} onClick={() => setActiveTab('specifications')}>
          <Settings size={18} /> Specifications
        </div>
        <div className={`${styles.tab} ${activeTab === 'applications' ? styles.tabActive : ''}`} onClick={() => setActiveTab('applications')}>
          <LayoutGrid size={18} /> Applications
        </div>
        <div className={`${styles.tab} ${activeTab === 'downloads' ? styles.tabActive : ''}`} onClick={() => setActiveTab('downloads')}>
          <Download size={18} /> Downloads
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className={styles.animateFadeInUp}>
        
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className={styles.contentBlock}>
            <h3>Overview</h3>
            <p style={{ whiteSpace: "pre-line" }}>
              {product.longDescription || product.description || "The " + product.title + " represents the pinnacle of industrial engineering. Designed with precision components, it ensures long-term reliability and accurate performance under the most demanding conditions."}
            </p>
            <br />
            <h3>Advantages</h3>
            <ul style={{ color: "var(--text-muted)", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
              <li>Superior build quality with premium materials.</li>
              <li>High resistance to extreme temperatures and pressures.</li>
              <li>Seamless integration with existing automation systems.</li>
              <li>Low maintenance requirements resulting in lower TCO.</li>
            </ul>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className={styles.contentBlock} style={{ padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
            <table className={styles.specsTable}>
              <tbody>
                {specs.map((spec: any, idx: number) => (
                  <tr key={idx}>
                    <td className={styles.specLabel}>{spec.label}</td>
                    <td className={styles.specValue}>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {applications.map((app: any, idx: number) => (
              <div key={idx} className={styles.appCard}>
                <div className={styles.appIcon}>
                  {app.icon}
                </div>
                <h4 className={styles.appTitle}>{app.title}</h4>
                <p className={styles.appDesc}>{app.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {product.catalogueAttachment && (
              <a href={product.catalogueAttachment} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div className={styles.downloadCard}>
                  <div className={styles.dlIconWrapper}>
                    <FileText size={24} />
                  </div>
                  <div className={styles.dlInfo}>
                    <div className={styles.dlTitle}>Product Datasheet</div>
                    <div className={styles.dlSize}>PDF • 2.4 MB</div>
                  </div>
                  <Download size={20} color="var(--royal-blue)" />
                </div>
              </a>
            )}
            
            {certificates.map((cert: any, idx: number) => (
              <a key={idx} href="#" style={{ textDecoration: "none" }}>
                <div className={styles.downloadCard}>
                  <div className={styles.dlIconWrapper}>
                    <Award size={24} />
                  </div>
                  <div className={styles.dlInfo}>
                    <div className={styles.dlTitle}>{cert.title}</div>
                    <div className={styles.dlSize}>{cert.type} • {cert.size}</div>
                  </div>
                  <Download size={20} color="var(--royal-blue)" />
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
