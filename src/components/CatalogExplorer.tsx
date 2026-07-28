"use client";

import { Filter } from "lucide-react";
import styles from "./CatalogExplorer.module.css";
import CategoryGrid from "./CategoryGrid";

export default function CatalogExplorer({ data = [] }: { data?: any[] }) {
  return (
    <section id="products" className={styles.productsSection}>
      <div className={styles.container}>
        
        {/* Section Title */}
        <div className={styles.headerBlock}>
          <div className={styles.badge}>
            <Filter size={14} className={styles.goldIcon} />
            <span>International Catalog</span>
          </div>
          <h2 className={styles.title}>
            Industrial Sourcing & <br />
            <span className="blue-gradient-text">Engineering Supply Portfolio</span>
          </h2>
          <p className={styles.subtitle}>
            Explore our Fortune 500 grade catalog of industrial products, process instruments, 
            and certified electrical components available for worldwide export.
          </p>
        </div>

        {/* Categories Grid (Top-Level) */}
        <CategoryGrid items={data} basePath="/products" />

      </div>
    </section>
  );
}
