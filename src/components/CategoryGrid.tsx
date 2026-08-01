"use client";

import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { cardSrcSet, CARD_SIZES } from "@/lib/img";
import styles from "./catalog/ProductUI.module.css";

export default function CategoryGrid({ items, basePath = "/products" }: { items: any[], basePath?: string }) {
  // Separate items by type
  const categories = items.filter((item) => item.type === "category");
  const products = items.filter((item) => item.type === "product");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ color: "var(--text-white)", fontSize: "1.2rem", fontWeight: 700 }}>No items currently available.</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Please check back later or contact us for custom sourcing.</p>
        </div>
      )}

      {categories.length > 0 && (
        <div>
          {products.length > 0 && (
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--text-white)" }}>
              Categories
            </h2>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {categories.map((item: any, idx: number) => {
              const href = `${basePath}/${item.slug}`;
              const childrenCount = item.children ? item.children.length : 0;
              
              return (
                <Link 
                  href={href}
                  key={item.id || item.slug} 
                  className={`${styles.categoryCard} ${styles.animateFadeInUp}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={styles.categoryImageWrapper}>
                    {item.image || item.coverImage ? (
                      <img
                        src={item.image || item.coverImage}
                        srcSet={cardSrcSet(item.image || item.coverImage)}
                        sizes={CARD_SIZES}
                        alt={item.title}
                        className={styles.categoryImage}
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={750}
                      />
                    ) : (
                      <Package size={64} color="rgba(255,255,255,0.1)" />
                    )}
                    <div className={styles.categoryOverlay}></div>
                  </div>

                  <div className={styles.categoryContent}>
                    <h3 className={styles.categoryTitle}>{item.title}</h3>
                    <div className={styles.productCount}>
                      <Package size={14} />
                      {childrenCount} Products
                    </div>
                    
                    <p className={styles.categoryDesc}>
                      {item.description || item.shortDescription || "Explore our premium selection of industrial components in this category."}
                    </p>

                    <div className={styles.exploreBtn}>
                      Explore Category
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div>
          {categories.length > 0 && (
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--text-white)" }}>
              Products
            </h2>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {products.map((item: any, idx: number) => {
              const href = `${basePath}/${item.slug}`;
              const isNew = idx === 0; // Simple logic to show a badge for the first item
              const isPopular = idx === 1;

              return (
                <Link 
                  href={href}
                  key={item.id || item.slug} 
                  className={`${styles.productCard} ${styles.animateFadeInUp}`}
                  style={{ animationDelay: `${(idx + categories.length) * 0.1}s` }}
                >
                  {isNew && <div className={styles.badge}>New</div>}
                  {isPopular && <div className={`${styles.badge} ${styles.badgeBlue}`}>Popular</div>}
                  
                  <div className={styles.productImageWrapper}>
                    {item.image || item.coverImage ? (
                      <img
                        src={item.image || item.coverImage}
                        srcSet={cardSrcSet(item.image || item.coverImage)}
                        sizes={CARD_SIZES}
                        alt={item.title}
                        className={styles.productImage}
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={750}
                      />
                    ) : (
                      <Package size={48} color="rgba(21, 101, 255, 0.2)" />
                    )}
                  </div>

                  <div className={styles.productContent}>
                    <h3 className={styles.productTitle}>{item.title}</h3>
                    
                    <p className={styles.productDesc}>
                      {item.shortDescription || item.description || "High-performance industrial product ready for export."}
                    </p>

                    <div className={styles.viewDetailsBtn}>
                      View Details
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
